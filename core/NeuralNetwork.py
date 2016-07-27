import os;
import numpy as np;
import theano;
import theano.tensor as T;
import math;
import lasagne;
import time;

WEIGHTS_FOLDER_NAME = "weights";
EPOCHS_PER_PRINT = 50;

class NeuralNetwork:	


	def __init__(self, name, inputCount, outputCount, learningRate = 0.01, depth = 2, width = 800, dropInput = 0.2, dropHidden = 0.5):
		# Identificador da rede (utilizado para salvar/carregar os pesos)
		self.name = name;
		self.input_var = T.dmatrix('inputs');
		self.target_var = T.lvector('targets');		
		self.learningRate = learningRate;
		self.outputCount = outputCount;
		self.normalizeOutput = False;
		self.maxOutput = None;

		self.buildMLP(inputCount, outputCount, depth, width, dropInput, dropHidden);				

	def train(self, numEpochs, X_train, y_train, X_val, y_val):
		prediction = lasagne.layers.get_output(self.network);
		loss = lasagne.objectives.categorical_crossentropy(prediction, self.target_var);
		loss = loss.mean();
	    	    
		print("learningRate: " + str(self.learningRate));
		params = lasagne.layers.get_all_params(self.network, trainable=True);
		updates = lasagne.updates.nesterov_momentum(loss, params, learning_rate=self.learningRate, momentum=0.9);

		test_prediction = lasagne.layers.get_output(self.network, deterministic=True);
		test_loss = lasagne.objectives.categorical_crossentropy(test_prediction, self.target_var);
		test_loss = test_loss.mean();
		test_acc = T.mean(T.eq(T.argmax(test_prediction, axis=1), self.target_var), dtype=theano.config.floatX);

		train_fn = theano.function([self.input_var, self.target_var], loss, updates=updates);	    
		val_fn = theano.function([self.input_var, self.target_var], [test_loss, test_acc]);		

		print("Starting training...");

		global EPOCHS_PER_PRINT;
		printerCount = 0;	    
		for epoch in range(numEpochs):	        
			train_err = 0;
			train_batches = 0;
			start_time = time.time();
			for batch in self.iterate_minibatches(X_train, y_train, 1, shuffle=True):
				inputs, targets = batch;
				train_err += train_fn(inputs, targets);
				train_batches += 1;				
	        
			val_err = 0;
			val_acc = 0;			
			val_batches = 0;
			for batch in self.iterate_minibatches(X_val, y_val, 1, shuffle=False):
				inputs, targets = batch;
				err, acc = val_fn(inputs, targets);
				val_err += err;
				val_acc += acc;
				val_batches += 1;			

			printerCount += 1;
			if ((printerCount == 1) or ((printerCount % EPOCHS_PER_PRINT) == 0)):				
				print("Epoch {} of {} took {:.3f}s".format((epoch + 1), numEpochs, time.time() - start_time));
				print("  training loss:\t\t{:.6f}".format(train_err / train_batches));
				print("  validation loss:\t\t{:.6f}".format(val_err / val_batches));
				print("  validation accuracy:\t\t{:.2f} %".format(val_acc / val_batches * 100));
		# Salva os pesos da rede
		self.save();


	def test(self, X_test, y_test):
		# Carrega os pesos da rede
		self.load();

		test_prediction = lasagne.layers.get_output(self.network, deterministic=True);
		test_loss = lasagne.objectives.categorical_crossentropy(test_prediction, self.target_var);
		test_loss = test_loss.mean();

		test_acc = T.mean(T.eq(T.argmax(test_prediction, axis=1), self.target_var), dtype=theano.config.floatX);
		val_fn = theano.function([self.input_var, self.target_var], [test_loss, test_acc]);

		predictionFunction = theano.function([self.input_var], [test_prediction]);

		test_err = 0;
		test_acc = 0;
		test_batches = 0;
		normalizedError = 0;
		for batch in self.iterate_minibatches(X_test, y_test, 1, shuffle=False):
			inputs, targets = batch;
			err, acc = val_fn(inputs, targets);
			test_err += err;
			test_acc += acc;
			test_batches += 1;	
		accuracy = ((test_acc / test_batches) * 100);
		error = (test_err / test_batches);		
		print("Final results:");
		print("  test loss:\t\t\t{:.6f}".format(error));
		print("  test accuracy:\t\t{:.2f} %".format(accuracy));	    
		return accuracy, error, normalizedError;

	def predict(self, inputs):
		# Carrega os pesos da rede
		self.load();
		
		test_prediction = lasagne.layers.get_output(self.network, deterministic=True);		
		predictionFunction = theano.function([self.input_var], [test_prediction]);
		predictionValues = predictionFunction(inputs);

		# Retorna o INDICE que possui o dado com MAIOR valor no array
		return np.argmax(predictionValues);

	# Salva os pesos da rede
	def save(self):
		global WEIGHTS_FOLDER_NAME;
		if (not os.path.isdir(WEIGHTS_FOLDER_NAME)):
			os.mkdir(WEIGHTS_FOLDER_NAME);
		np.savez((WEIGHTS_FOLDER_NAME + "/" + (self.name + " weights.npz")), *lasagne.layers.get_all_param_values(self.network));

	# Carrega os pesos para reconfigurar uma rede salva
	def load(self):
		global WEIGHTS_FOLDER_NAME;
		if (os.path.isdir(WEIGHTS_FOLDER_NAME)):
			path = (WEIGHTS_FOLDER_NAME + "/" + (self.name + " weights.npz"));
			with np.load(path) as f:
				paramValues = [f['arr_%d' % i] for i in range(len(f.files))]
			lasagne.layers.set_all_param_values(self.network, paramValues);
		else:
			print("Arquivos de pesos NAO encontrado.");

	def buildMLP(self, inputCount, outputCount, depth=2, width=800, drop_input=0.2, drop_hidden=0.5):
		# Input layer and dropout
		self.network = lasagne.layers.InputLayer(shape=(1, inputCount), input_var=self.input_var);
		if drop_input:
		    self.network = lasagne.layers.dropout(self.network, p=drop_input);
		# Hidden layers and dropout:
		nonlin = lasagne.nonlinearities.rectify;
		for _ in range(depth):
		    self.network = lasagne.layers.DenseLayer(self.network, width, nonlinearity=nonlin);
		    if drop_hidden:
		        self.network = lasagne.layers.dropout(self.network, p=drop_hidden);
		# Output layer:
		softmax = lasagne.nonlinearities.softmax;
		self.network = lasagne.layers.DenseLayer(self.network, outputCount, nonlinearity=softmax);
		return self.network;

	def iterate_minibatches(self, inputs, targets, batchsize, shuffle=False):		
		if (len(inputs) != len(targets)):
			print("[NeuralNetwork]: {iterate_minibatches} \"inputs\" (length: " + str(len(inputs)) + ") and \"targets\" (length: " + str(len(targets)) + ") must have the same size.");
			return;

		if shuffle:
			indices = np.arange(len(inputs));
			np.random.shuffle(indices);
		for start_idx in range(0, len(inputs) - batchsize + 1, batchsize):
			if shuffle:
				excerpt = indices[start_idx:start_idx + batchsize];
			else:
				excerpt = slice(start_idx, start_idx + batchsize);
			yield inputs[excerpt], targets[excerpt];