import * as tf from '@tensorflow/tfjs';


// export class NeuralNet0 {
//     private W0: tf.Tensor2D;
//     private W1: tf.Tensor2D;

//     private nPotentials: tf.Variable; //tf.Tensor1D;

//     private minW: number = -10.0;
//     private maxW: number = 10.0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.W0 = tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW);
//         this.W1 = tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW);
        
//         this.nPotentials = tf.variable(tf.zeros([this.W0.shape[0]]));

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: Array<number>): Array<number> {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         console.log(`nPot: ${this.nPotentials.bufferSync().get(0)}, ${this.nPotentials.bufferSync().get(1)}, ${this.nPotentials.bufferSync().get(2)}, ...`);
        

//         // this.nPotentials.assign(tf.tidy(() => {
//         // const nP: tf.Variable = tf.tidy(() => {
//         return tf.tidy(() => {
//             // this.nPotentials = tf.zeros([this.W0.shape[0]]);
//             const nP_buff = this.nPotentials.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 nP_buff.set(input[i] + nP_buff.get(i), i);                
//             }
//             this.nPotentials.assign(nP_buff.toTensor());
//             let nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor1D; //.add(this.B0));

//             // console.log(`nPot shape: ${this.nPotentials.shape}`);
//             // console.log(`nAct shape: ${nActivation.shape}`);
//             // console.log(`W shape: ${this.W.shape}`);

//             this.nPotentials.assign(nActivation.dot(this.W0).add(this.nPotentials.mul(tf.scalar(1).sub(nActivation)))); // as tf.Tensor1D; //.add(this.nPotentials);
//             nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor1D;

//             this.nPotentials.assign(this.nPotentials.mul(tf.scalar(1).sub(nActivation)));

//             // this.nPotentials.assign(nActivation.dot(this.W0)); // as tf.Tensor1D; //.add(this.nPotentials);
//             // nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor1D;

//             // this.nPotentials.assign(nActivation.dot(this.W0)); // as tf.Tensor1D;
//             // nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor1D;

//             // this.nPotentials.assign(nActivation.dot(this.W0)); // as tf.Tensor1D;
//             // nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor1D;

//             return nActivation.slice([nActivation.shape[0] - 3], [3]).arraySync();
//             // return this.nPotentials;
//         });
//         // this.nPotentials.dispose();
//         // this.nPotentials.assign(nP.clone());
//         // nP.dispose();
//         // return this.nPotentials.sigmoid().slice([this.nPotentials.shape[0] - 3], [3]).arraySync() as Array<number>;
//     }

//     dispose() {
//         tf.dispose([this.W0, this.W1, this.nPotentials]);
//     }
// }

// export class NeuralNet1 {
//     private W0: tf.Tensor2D;
//     private W1: tf.Tensor2D;
//     private B0: tf.Tensor2D;
//     private B1: tf.Tensor2D;

//     private nPotentials: tf.Variable;
//     // private nActivation: tf.Variable;

//     private minW: number = -5.0;
//     private maxW: number = 5.0;
//     private minB: number = -5.0;
//     private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.W0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.W1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
//         this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotentials = tf.tidy(() => {return tf.variable(tf.zerosLike(this.W0))});
//         // this.nActivation = tf.variable(tf.zerosLike(this.W0));

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         const mem = tf.memory();
//         console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotentials.bufferSync().get(0)}, ${this.nPotentials.bufferSync().get(1)}, ${this.nPotentials.bufferSync().get(2)}, ...`);
        
//         return tf.tidy(() => {
//             const nP_buff = this.nPotentials.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 nP_buff.set(input[i] + nP_buff.get(i, this.colIdx), i, this.colIdx);                
//             }
//             this.nPotentials.assign(nP_buff.toTensor());
//             let nActivation = tf.sigmoid(this.nPotentials.add(this.B0)) as tf.Tensor2D;

//             // console.log(`nPot shape: ${this.nPotentials.shape}`);
//             // console.log(`nAct shape: ${nActivation.shape}`);
//             // console.log(`W shape: ${this.W.shape}`);

//             this.nPotentials.assign(nActivation.matMul(this.W0).add(this.nPotentials.mul(tf.scalar(1).sub(nActivation))));0
//             nActivation = tf.sigmoid(this.nPotentials.add(this.B0)) as tf.Tensor2D;

//             this.nPotentials.assign(nActivation.transpose().matMul(this.W1).add(this.nPotentials.transpose().mul(tf.scalar(1).sub(nActivation.transpose()))));
//             nActivation = tf.sigmoid(this.nPotentials.add(this.B1)) as tf.Tensor2D;

//             return nActivation.slice([0, nActivation.shape[1] - 3], [-1, 3]).arraySync()[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.W0, this.W1, this.B0, this.B1, this.nPotentials]);
//     }
// }

// export class NeuralNet2 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     // private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nPotentials: tf.Variable;

//     private minW: number = -1.0;
//     private maxW: number = 1.0;
//     // private minB: number = -5.0;
//     // private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotentials = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotentials.bufferSync().get(0)}, ${this.nPotentials.bufferSync().get(1)}, ${this.nPotentials.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotentials.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 nP_buff.set((input[i] / 10.0) + nP_buff.get(i, this.colIdx), i, this.colIdx);                
//             }
//             this.nPotentials.assign(nP_buff.toTensor());

//             const nP = this.nPotentials.matMul(this.C0);
//             const wP = this.nPotentials.matMul(this.C1);

//             // const n = nP.add(this.B0).sigmoid();
//             // const w = wP.add(this.B1).tanh();
//             const n = nP.sigmoid();
//             const w = wP.atan(); //tanh();

//             this.nPotentials.assign(n.matMul(w));
//             const nActivation = tf.sigmoid(this.nPotentials) as tf.Tensor2D;

//             return nActivation.slice([0, nActivation.shape[1] - 3], [-1, 3]).arraySync()[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.nPotentials]); //this.B0, this.B1, this.nPotentials]);
//     }
// }

// export class NeuralNet3 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     // private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;

//     private minW: number = -1.0;
//     private maxW: number = 1.0;
//     private minB: number = -5.0;
//     private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxB - this.minB).add(this.minB)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotentials.bufferSync().get(0)}, ${this.nPotentials.bufferSync().get(1)}, ${this.nPotentials.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const wP = this.nActivation.matMul(this.C0);
//             const wP_buff = wP.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i] / 10.0
//                 wP_buff.set(iVal + wP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const w = wP_buff.toTensor().atan(); //.tanh();

//             const nP = this.C1.matMul(this.nActivation).matMul(w);
//             const nP_buff = nP.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i] / 10.0
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             this.nActivation.assign(nP_buff.toTensor().sigmoid())

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.nActivation]);
//     }
// }

// export class NeuralNet4 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;

//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     // private minW: number = -10.0; //-5.0;
//     // private maxW: number = 10.0; //5.0;
//     // private minB: number = -10; //-5.0;
//     // private maxB: number = 10; //5.0;

//     // private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//         // mask_arr: number[][][],
//         // dropOut: boolean
//     ) {
//         // if (dropOut) {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

//         //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
//         // } else {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         // }
//         // this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});

//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0])});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1])});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2])});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3])});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4])});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         // tf.setBackend('cpu');
//         // console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             // const nP_buff = this.nActivation.bufferSync();
//             // for (let i = 0; i < input.length; i++) {
//             //     const iVal = input[i]; // / 10.0;
//             //     nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             // }
//             const nP_buff = this.nPotential.bufferSync() as tf.TensorBuffer<tf.Rank.R2>;
            
//             for (let i = 0; i < nP_buff.shape[0]; i++) {
//                 for (let j = 0; j < input.length; j++) {
//                     const iVal = input[j]; // / 10.0;
//                     // nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//                     nP_buff.set(iVal, i, j);
//                     // nP_buff.set(iVal, i, this.colIdx);
//                 }
//             }
//             const nP = nP_buff.toTensor();

//             const deltaP = this.C1.matMul(this.nActivation.matMul(this.C0));
//             // const nA = this.nPotential.tanh();
//             // const deltaP = this.C1.matMul(nA.matMul(this.C0));
            
//             // this.nPotential.assign(nP.add(deltaP));
//             this.nPotential.assign(this.nPotential.add(nP.add(deltaP)));
//             // const nPotential = nP.add(deltaP);

//             this.nActivation.assign(this.nPotential.add(this.B0).tanh().relu()); //.sigmoid()); //.tanh().relu()); //.sigmoid());
//             // this.nActivation.assign(nPotential.add(this.B0).tanh().relu());

//             // const r = this.nPotential.mul(tf.scalar(1).sub(this.nActivation));
//             const r = this.C3.matMul(this.nActivation.matMul(this.C2)).tanh().relu(); //.sigmoid();
//             this.nPotential.assign(this.nPotential.mul(r));

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         // Ensure all tensors and variables are disposed to avoid memory leaks
//         try {
//             tf.dispose([this.C0, this.C1, this.C2, this.C3, this.B0, this.nActivation]);
//         } finally {
//             // nPotential is a tf.Variable and should be disposed separately if present
//             // Use an unknown cast to avoid `any` in linting rules
//             const maybeNP = this.nPotential as unknown;
//             if (maybeNP && typeof (maybeNP as { dispose?: unknown }).dispose === 'function') {
//                 try { (maybeNP as { dispose: () => void }).dispose(); } catch { /* ignore */ }
//             }
//         }
//     }
// }

// export class NeuralNet5 {
//     private W: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nPotential: tf.Variable;
//     private nActivation: tf.Variable;

//     private minW: number = -15.0;
//     private maxW: number = 15.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.W = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zeros([this.W.shape[0]]))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zeros([this.W.shape[0]]))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         const mem = tf.memory();
//         console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 nP_buff.set(input[i] + nP_buff.get(i), i);                
//             }
//             const nP = nP_buff.toTensor();

//             const deltaP = this.nActivation.dot(this.W);
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.sigmoid());

//             this.nPotential.assign(this.nPotential.mul(tf.scalar(1).sub(this.nActivation)));

//             const out = this.nActivation.slice([this.nActivation.shape[0] - 3], [3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.W, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet6 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     // private nActivation: tf.Variable;
//     // private nPotential: tf.Variable;

//     private minW: number = -5.0;
//     private maxW: number = 5.0;
//     // private minB: number = -5.0;
//     // private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         // this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         // this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         tf.setBackend('cpu');

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nPotential = tf.variable(tf.zerosLike(this.C0));
//             const nP_buff = nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             let nActivation = nP.tanh().relu();

//             nActivation = nActivation.matMul(this.C0).tanh().relu();
            
//             nActivation = nActivation.transpose().matMul(this.C1).tanh().relu();

//             nActivation = nActivation.matMul(this.C2).tanh().relu();

//             const out = nActivation.slice([0, nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2]);
//     }
// }

// export class NeuralNet7 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     private minW: number = -5.0;
//     private maxW: number = 5.0;
//     private minB: number = -5.0;
//     private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             const W0 = this.nActivation.matMul(this.C0).sigmoid();
//             const W1 = this.C1.matMul(this.nActivation).tanh();

//             const deltaP = W1.matMul(this.nActivation.matMul(W0));
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.add(this.B0).sigmoid()); //.tanh().relu()); //.sigmoid());

//             this.nPotential.assign(this.nPotential.mul(tf.scalar(1).sub(this.nActivation)));

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.B0, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet8 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;
//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     private minW: number = -1.0;
//     private maxW: number = 1.0;
//     private minB: number = -5.0;
//     private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const scale = tf.scalar(Math.sqrt(this.nPotential.shape[0]));
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             const Q = nP.matMul(this.C0);
//             const K = nP.matMul(this.C1).transpose().sigmoid();
//             const V = nP.matMul(this.C2);

//             const QK = Q.matMul(K);
//             const scaledAttention = QK.div(scale);
//             const attentionWeights = tf.softmax(scaledAttention, -1);

//             const deltaP = attentionWeights.matMul(V).tanh().matMul(this.C3);
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.add(this.B0).sigmoid()); //.tanh().relu()); //.sigmoid());
            

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.B0, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet9 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;
    
//     private B0: tf.Tensor2D;
//     private B1: tf.Tensor2D;

//     private Neurons: tf.Variable;
//     private Weights: tf.Variable;

//     private minC: number = -1.0;
//     private maxC: number = 1.0;
//     private minB: number = -15.0;
//     private maxB: number = 15.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxC - this.minC).add(this.minC)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxC - this.minC).add(this.minC)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxC - this.minC).add(this.minC)});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxC - this.minC).add(this.minC)});
//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});
//         this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[5]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.Neurons = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.Weights = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`N: ${this.Neurons.bufferSync().get(0)}, ${this.Neurons.bufferSync().get(1)}, ${this.Neurons.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = tf.zerosLike(this.C0).bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal, i, this.colIdx);
//             }
//             const iMatrix = nP_buff.toTensor();

//             this.Neurons.assign(iMatrix.add(this.B0).sigmoid());
//             this.Weights.assign(this.B1.tanh());

//             const A0 = this.C0.matMul(this.Neurons);
//             const A1 = this.C1.matMul(this.Neurons);
//             const V0 = this.Weights.matMul(this.C2);
//             const V1 = this.Weights.matMul(this.C3);

//             const Sw = A0.matMul(V0);
//             const Sn = A1.matMul(V1);
            
//             // this.Neurons.assign(Sn.add(iMatrix).sigmoid());
//             // this.Weights.assign(Sw.tanh());
            
//             this.Neurons.assign(Sn.add(iMatrix).add(this.B0).sigmoid());
//             this.Weights.assign(Sw.add(this.B1).tanh());

//             const out = this.Neurons.slice([0, this.Neurons.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.Neurons, this.Weights]);
//     }
// }

// export class NeuralNet10 {
//     // Ganglion A11
//     private Ci0: tf.Tensor2D;
//     private Ci1: tf.Tensor2D;
//     private Ci2: tf.Tensor2D;

//     private Cn0: tf.Tensor2D;
//     private Cn1: tf.Tensor2D;
//     private Cn2: tf.Tensor2D;

//     private Cm0: tf.Tensor2D;
//     private Cm1: tf.Tensor2D;
//     private Cm2: tf.Tensor2D;

//     private nActivations: tf.Variable;
//     private nPotentials: tf.Variable;

//     private minCi: number = -1.5;
//     private maxCi: number = 1.5;
//     private minCn: number = -1.5;
//     private maxCn: number = 1.5;
//     private minCm: number = -5.0;
//     private maxCm: number = 5.0;

//     private alpha: number = 0.7;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.Ci0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxCi - this.minCi).add(this.minCi)});

//         this.Cn0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxCn - this.minCn).add(this.minCn)});
//         this.Cn1 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxCn - this.minCn).add(this.minCn)});
//         this.Cn2 = tf.tidy(() => {return tf.tensor2d(w_arr[5]).mul(this.maxCn - this.minCn).add(this.minCn)});

//         this.Cm0 = tf.tidy(() => {return tf.tensor2d(w_arr[6]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm1 = tf.tidy(() => {return tf.tensor2d(w_arr[7]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm2 = tf.tidy(() => {return tf.tensor2d(w_arr[8]).mul(this.maxCm - this.minCm).add(this.minCm)});
        
//         this.nPotentials = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});
//         this.nActivations = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const in_buff = tf.zerosLike(this.Ci0).bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 in_buff.set(iVal, i, this.colIdx);
//             }
//             const iMatrix = in_buff.toTensor();

//             const delta_Si = this.Ci2.matMul(iMatrix.mul(this.Ci0).matMul(this.Ci1));

//             const Wn0 = this.Cn0.mul(this.nActivations.matMul(this.Cm0).tanh());
//             const Wn1 = this.Cn1.mul(this.nActivations.matMul(this.Cm1).tanh());
//             const Wn2 = this.Cn2.mul(this.nActivations.matMul(this.Cm2).tanh());

//             const delta_Sn = Wn2.matMul(this.nActivations.mul(Wn0).matMul(Wn1));

//             this.nPotentials.assign(this.nPotentials.mul(tf.scalar(this.alpha)).mul(tf.scalar(1.0).sub(this.nActivations)).add(delta_Si).add(delta_Sn));

//             this.nActivations.assign(this.nPotentials.sigmoid());

//             const out = this.nActivations.slice([0, this.nActivations.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.Ci0, this.Ci1, this.Ci2, this.Cn0, this.Cn1, this.Cn2, this.Cm0, this.Cm1, this.Cm2, this.nPotentials, this.nActivations]);
//     }
// }

// export class NeuralNet11 {
//     // Ganglion A11
//     private Ci0: tf.Tensor2D;
//     private Ci1: tf.Tensor2D;

//     private Cm0: tf.Tensor2D;
//     private Cm1: tf.Tensor2D;

//     private nActivations: tf.Variable;
//     private nPotentials: tf.Variable;

//     private minCi: number = -1.5;
//     private maxCi: number = 1.5;
//     private minCm: number = -5.0;
//     private maxCm: number = 5.0;

//     private alpha: number = 0.7;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.Ci0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxCi - this.minCi).add(this.minCi)});

//         this.Cm0 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm1 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxCm - this.minCm).add(this.minCm)});
        
//         this.nPotentials = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});
//         this.nActivations = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const in_buff = tf.zerosLike(this.Ci0).bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 in_buff.set(iVal, i, this.colIdx);
//             }
//             const iMatrix = in_buff.toTensor();

//             const delta_Si = iMatrix.matMul(this.Ci0).transpose().matMul(this.Ci1);

//             const Wn0 = this.nActivations.matMul(this.Cm0).tanh();
//             const Wn1 = this.nActivations.matMul(this.Cm1).tanh();
//             // const Wn2 = this.nActivations.matMul(this.Cm2).tanh();

//             // const delta_Sn = this.nActivations.mul(Wn0).matMul(Wn1).transpose().matMul(Wn2);
//             const delta_Sn = this.nActivations.matMul(Wn0).transpose().matMul(Wn1);

//             this.nPotentials.assign(this.nPotentials.mul(tf.scalar(this.alpha)).mul(tf.scalar(1.0).sub(this.nActivations)).add(delta_Si).add(delta_Sn));

//             this.nActivations.assign(this.nPotentials.sigmoid());

//             const out = this.nActivations.slice([0, this.nActivations.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.Ci0, this.Ci1, this.Cm0, this.Cm1, this.nPotentials, this.nActivations]);
//     }
// }

// export class NeuralNet12 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     private minW: number = -10.0;
//     private maxW: number = 10.0;
//     private minB: number = -10.0;
//     private maxB: number = 10.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             const W0 = this.nActivation.matMul(this.C0).atan();
//             const W1 = this.nActivation.matMul(this.C1).atan();

//             const deltaP = W1.matMul(this.nActivation.matMul(W0));
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.add(this.B0).sigmoid()); //.tanh().relu()); //.sigmoid());

//             // this.nPotential.assign(this.nPotential.mul(tf.scalar(1).sub(this.nActivation)));
//             const r = this.nActivation.matMul(this.C2).sigmoid();
//             this.nPotential.assign(this.nPotential.mul(r));

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.B0, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet13 {
//     private W0: tf.Tensor2D;
//     private W1: tf.Tensor2D;
//     private W2: tf.Tensor2D;

//     private nActivation: tf.Variable;

//     private minW: number = -15.0;
//     private maxW: number = 15.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.W0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.W1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.W2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zeros([this.W0.shape[0]]))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         return tf.tidy(() => {
//             const in_buff = tf.zeros([this.W0.shape[0]]).bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 in_buff.set(input[i], i);                
//             }
//             const inData = in_buff.toTensor();

//             // console.log(`neuronAct: ${inData.arraySync()}`);
            

//             let nA = inData.dot(this.W0).sigmoid();
//             // nA = nA.dot(this.W1).sigmoid();
//             this.nActivation.assign(nA.dot(this.W1).add(this.nActivation.dot(this.W1)).tanh());
//             nA = this.nActivation.dot(this.W2).sigmoid();

//             const out = nA.slice([nA.shape[0] - 3], [3]).arraySync() as number[];

//             // console.log(`neuronOut: ${out}`);
            

//             return out;
//         });
//     }

//     dispose() {
//         tf.dispose([this.W0, this.W1, this.W2, this.nActivation]);
//     }
// }

// export class NeuralNet14 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;

//     private C4: tf.Tensor2D;
//     private C5: tf.Tensor2D;

//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     private minW: number = -5.0; //-5.0;
//     private maxW: number = 5.0; //5.0;
//     private minB: number = -20.0; //-5.0;
//     private maxB: number = 0.0; //5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//         // mask_arr: number[][][],
//         // dropOut: boolean
//     ) {
//         // if (dropOut) {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

//         //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
//         // } else {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         // }

//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         this.C4 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C5 = tf.tidy(() => {return tf.tensor2d(w_arr[5]).mul(this.maxW - this.minW).add(this.minW)});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[6]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             const deltaP0 = this.C1.matMul(this.nActivation.matMul(this.C0));
//             const deltaP1 = this.C3.matMul(this.nActivation.matMul(this.C2));
//             const deltaP = deltaP0.add(deltaP1);
//             // const nA = this.nPotential.tanh();
//             // const deltaP = this.C1.matMul(nA.matMul(this.C0));
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.add(this.B0).sigmoid());
//             // this.nActivation.assign(this.nPotential.add(this.B0).step()); //.sigmoid()); //.tanh().relu()); //.sigmoid());
//             // this.nActivation.assign(this.nPotential.add(this.B0).sign());

//             // const nA = this.nPotential.sigmoid();

//             // this.nPotential.assign(this.nPotential.mul(0.8).mul(tf.scalar(1).sub(this.nActivation)));
//             // const r = this.C5.matMul(this.nActivation.matMul(this.C4)).step() //.sigmoid();
//             const r = this.C5.matMul(this.nActivation.matMul(this.C4)).sigmoid();
//             this.nPotential.assign(this.nPotential.mul(0.8).mul(r));            
            
//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];
//             // const out = nA.slice([0, nA.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.C4, this.C5, this.B0, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet15 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;

//     private C4: tf.Tensor2D;
//     private C5: tf.Tensor2D;

//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     private minW: number = -5.0; //-5.0;
//     private maxW: number = 5.0; //5.0;
//     private minB: number = -5.0;
//     private maxB: number = 5.0;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//         // mask_arr: number[][][],
//         // dropOut: boolean
//     ) {
//         // if (dropOut) {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

//         //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
//         // } else {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         // }

//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         this.C4 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxW - this.minW).add(this.minW)});
//         this.C5 = tf.tidy(() => {return tf.tensor2d(w_arr[5]).mul(this.maxW - this.minW).add(this.minW)});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[6]).mul(this.maxB - this.minB).add(this.minB)});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const nP_buff = this.nPotential.bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             }
//             const nP = nP_buff.toTensor();

//             const deltaP0 = this.C1.matMul(this.nActivation.matMul(this.C0));
//             const deltaP1 = this.C3.matMul(this.nActivation.matMul(this.C2));
//             const deltaP = deltaP0.add(deltaP1);
//             // const nA = this.nPotential.tanh();
//             // const deltaP = this.C1.matMul(nA.matMul(this.C0));
            
//             this.nPotential.assign(nP.add(deltaP));

//             this.nActivation.assign(this.nPotential.add(this.B0).tanh().relu()); //.step()); //.tanh()); //.add(this.B0).step()); //.sigmoid()); //.tanh().relu()); //.sigmoid());
//             // this.nActivation.assign(this.nPotential.add(this.B0).sign());

//             const nA = this.nPotential.sigmoid();

//             // this.nPotential.assign(this.nPotential.mul(0.8).mul(tf.scalar(1).sub(this.nActivation)));
//             const r = this.C5.matMul(this.nActivation.matMul(this.C4)).tanh().relu(); //.step(); //.sigmoid();
//             // const r = this.C5.matMul(this.nActivation.matMul(this.C4)).add(this.B0).sigmoid(); //.step(); //.sigmoid();
//             this.nPotential.assign(this.nPotential.mul(0.9).mul(r));            
            
//             const out = nA.slice([0, nA.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.C4, this.C5, this.B0, this.nPotential, this.nActivation]);
//     }
// }

// export class NeuralNet16 {
//     // modified Ganglion A11
//     private Ci0: tf.Tensor2D;
//     private Ci1: tf.Tensor2D;
//     private Ci2: tf.Tensor2D;
//     private Ci3: tf.Tensor2D;

//     private Cn0: tf.Tensor2D;
//     private Cn1: tf.Tensor2D;
//     private Cn2: tf.Tensor2D;
//     private Cn3: tf.Tensor2D;

//     private Cm0: tf.Tensor2D;
//     private Cm1: tf.Tensor2D;
//     private Cm2: tf.Tensor2D;
//     private Cm3: tf.Tensor2D;

//     private nActivations: tf.Variable;
//     private nPotentials: tf.Variable;

//     private minCi: number = -1.5;
//     private maxCi: number = 1.5;
//     private minCn: number = -1.5;
//     private maxCn: number = 1.5;
//     private minCm: number = -1.5;
//     private maxCm: number = 1.5;

//     private alpha: number = 0.7;

//     private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//     ) {
//         this.Ci0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxCi - this.minCi).add(this.minCi)});
//         this.Ci3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxCi - this.minCi).add(this.minCi)});

//         this.Cn0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxCn - this.minCn).add(this.minCn)});
//         this.Cn1 = tf.tidy(() => {return tf.tensor2d(w_arr[5]).mul(this.maxCn - this.minCn).add(this.minCn)});
//         this.Cn2 = tf.tidy(() => {return tf.tensor2d(w_arr[6]).mul(this.maxCn - this.minCn).add(this.minCn)});
//         this.Cn3 = tf.tidy(() => {return tf.tensor2d(w_arr[7]).mul(this.maxCn - this.minCn).add(this.minCn)});

//         this.Cm0 = tf.tidy(() => {return tf.tensor2d(w_arr[8]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm1 = tf.tidy(() => {return tf.tensor2d(w_arr[9]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm2 = tf.tidy(() => {return tf.tensor2d(w_arr[10]).mul(this.maxCm - this.minCm).add(this.minCm)});
//         this.Cm3 = tf.tidy(() => {return tf.tensor2d(w_arr[11]).mul(this.maxCm - this.minCm).add(this.minCm)});
        
//         this.nPotentials = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});
//         this.nActivations = tf.tidy(() => {return tf.variable(tf.zerosLike(this.Ci0))});

//         console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             const in_buff = tf.zerosLike(this.Ci0).bufferSync();
//             for (let i = 0; i < input.length; i++) {
//                 const iVal = input[i]; // / 10.0;
//                 in_buff.set(iVal, i, this.colIdx);
//             }
//             const iMatrix = in_buff.toTensor();

//             const delta_Si_0 = this.Ci1.matMul(iMatrix.matMul(this.Ci0));
//             const delta_Si_1 = this.Ci3.matMul(iMatrix.matMul(this.Ci2));
//             const delta_Si = delta_Si_0.add(delta_Si_1);

//             const Wn0 = this.Cn0.mul(this.nActivations.matMul(this.Cm0).tanh());
//             const Wn1 = this.Cn1.mul(this.nActivations.matMul(this.Cm1).tanh());

//             const Wn2 = this.Cn2.mul(this.nActivations.matMul(this.Cm2).tanh());
//             const Wn3 = this.Cn3.mul(this.nActivations.matMul(this.Cm3).tanh());

//             const delta_Sn_0 = Wn1.matMul(this.nActivations.matMul(Wn0));
//             const delta_Sn_1 = Wn3.matMul(this.nActivations.matMul(Wn2));
//             const delta_Sn = delta_Sn_0.add(delta_Sn_1);

//             this.nPotentials.assign(this.nPotentials.mul(tf.scalar(this.alpha)).mul(tf.scalar(1.0).sub(this.nActivations)).add(delta_Si).add(delta_Sn));

//             this.nActivations.assign(this.nPotentials.tanh().relu()); //.sigmoid());

//             const out = this.nActivations.slice([0, this.nActivations.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.Ci0, this.Ci1, this.Ci2, this.Cn0, this.Cn1, this.Cn2, this.Cm0, this.Cm1, this.Cm2, this.nPotentials, this.nActivations]);
//     }
// }

// export class NeuralNet17 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;

//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     // private nPotential: tf.Variable;

//     // private minW: number = -10.0; //-5.0;
//     // private maxW: number = 10.0; //5.0;
//     // private minB: number = -10; //-5.0;
//     // private maxB: number = 10; //5.0;

//     // private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//         // mask_arr: number[][][],
//         // dropOut: boolean
//     ) {
//         // if (dropOut) {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

//         //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
//         // } else {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         // }
//         // this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});

//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0])});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1])});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2])});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3])});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4])});
        
//         // this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         // tf.setBackend('cpu');
//         // console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             // const nP_buff = this.nActivation.bufferSync();
//             // for (let i = 0; i < input.length; i++) {
//             //     const iVal = input[i]; // / 10.0;
//             //     nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             // }
//             const nP_buff = this.nActivation.bufferSync() as tf.TensorBuffer<tf.Rank.R2>;
            
//             for (let i = 0; i < nP_buff.shape[0]; i++) {
//                 for (let j = 0; j < input.length; j++) {
//                     const iVal = input[j]; // / 10.0;
//                     // nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//                     nP_buff.set(iVal, i, j);
//                     // nP_buff.set(iVal, i, this.colIdx);
//                 }
//             }
//             const nP = nP_buff.toTensor();

//             // const W0 = this.nActivation.matMul(this.C0).tanh();
//             // const W1 = this.nActivation.matMul(this.C1).tanh();

//             // const deltaP = W1.matMul(this.nActivation.matMul(W0));

//             const deltaP = this.C1.matMul(this.nActivation.matMul(this.C0));
//             // const nA = this.nPotential.tanh();
//             // const deltaP = this.C1.matMul(nA.matMul(this.C0));

//             // const W2 = this.nActivation.matMul(this.C2).tanh();
//             // const W3 = this.nActivation.matMul(this.C3).tanh();

//             // const deltaP2 = W3.matMul(this.nActivation.matMul(W2));
            
//             // this.nPotential.assign(nP.add(deltaP));
//             // this.nPotential.assign(this.nPotential.add(nP.add(deltaP))); //.add(deltaP2)));

//             // this.nActivation.assign(this.nPotential.add(this.B0).sigmoid()); //.tanh().relu()); //.sigmoid());
//             const A = nP.add(deltaP).sigmoid(); //.tanh().relu(); //.sigmoid();

//             // this.nPotential.assign(this.nPotential.mul(tf.scalar(1).sub(this.nActivation)));
//             // const r = W3.matMul(this.nActivation.matMul(W2)).tanh().relu(); //.sigmoid();
//             // this.nPotential.assign(this.nPotential.mul(r));

//             // const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             // const W2 = this.nActivation.matMul(this.C2).tanh();
//             // const W3 = this.nActivation.matMul(this.C3) //.tanh();
//             // const W2 = A.matMul(this.C2).tanh();
//             // const W3 = A.matMul(this.C3).tanh();

//             // const outP = W3.matMul(A.matMul(W2));

//             const outP = this.C3.matMul(A.matMul(this.C2));
//             // const outA = outP.sigmoid(); //.tanh().relu(); //.sigmoid();
//             // this.nActivation.assign(this.nPotential.add(this.B0).sigmoid());
//             this.nActivation.assign(outP.add(this.B0).sigmoid());

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         // tf.dispose([this.C0, this.C1, this.C2, this.C3, this.B0, this.nPotential, this.nActivation]);
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.B0, this.nActivation]);
//     }
// }

export class NeuralNet18 {
    private C0: tf.Tensor2D;
    private C1: tf.Tensor2D;
    private C2: tf.Tensor2D;
    private C3: tf.Tensor2D;
    private C4: tf.Tensor2D;
    private C5: tf.Tensor2D;

    private B0: tf.Tensor2D;
    private B1: tf.Tensor2D;

    private nActivation: tf.Variable;
    private nPotential: tf.Variable;

    // private minW: number = -10.0; //-5.0;
    // private maxW: number = 10.0; //5.0;
    // private minB: number = -10; //-5.0;
    // private maxB: number = 10; //5.0;

    // private rowIdx = 0;
    // private colIdx = 0;

    constructor(
        w_arr: number[][][],
        // mask_arr: number[][][],
        // dropOut: boolean
    ) {
        // if (dropOut) {
        //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
        //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
        //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

        //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
        // } else {
        //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
        //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
        //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

        // }
        // this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
        // this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
        // this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
        // this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

        // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});

        this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0])});
        this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1])});
        this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2])});
        this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3])});
        this.C4 = tf.tidy(() => {return tf.tensor2d(w_arr[4])});
        this.C5 = tf.tidy(() => {return tf.tensor2d(w_arr[5])});

        this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[6])});
        this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[7])});
        
        this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
        this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

        // tf.setBackend('cpu');
        // console.log(`TF backend: ${tf.getBackend()}`);
    }

    forward(input: number[]): number[] {
        // const mem = tf.memory();
        // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

        // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

        return tf.tidy(() => {
            const nP_buff = this.nPotential.bufferSync() as tf.TensorBuffer<tf.Rank.R2>;
            
            for (let i = 0; i < nP_buff.shape[0]; i++) {
                for (let j = 0; j < input.length; j++) {
                    const iVal = input[j]; // / 10.0;
                    // nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
                    nP_buff.set(iVal, i, j);
                    // nP_buff.set(iVal, i, this.colIdx);
                }
            }
            // const nP = nP_buff.toTensor();
            const nP = nP_buff.toTensor();

            // const deltaP = this.C1.matMul(this.nActivation.matMul(this.C0));

            // const deltaP2 = this.C3.matMul(this.nActivation.matMul(this.C2));

            // const deltaP3 = this.C5.matMul(this.nActivation.matMul(this.C4));

            // nP = nP.add(deltaP.add(deltaP2).add(deltaP3));
            // this.nActivation.assign(nP.add(this.B0).tanh().relu());
            
            const p = this.nActivation.matMul(this.C0);
            let x = nP.mul(this.B1).add(p).tanh().relu();

            x = this.C1.matMul(x).tanh().relu();

            x = x.matMul(this.C2).tanh().relu();
            x = this.C3.matMul(x).tanh().relu();
            x = x.matMul(this.C4).tanh().relu();
            this.nActivation.assign(this.C5.matMul(x).add(this.B0).tanh().relu());

            const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

            return out[0];
        });
    }

    dispose() {
        tf.dispose([this.C0, this.C1, this.C2, this.C3, this.C4, this.C5, this.B0, this.B1, this.nPotential, this.nActivation]);
    }
}

// export class NeuralNet19 {
//     private C0: tf.Tensor2D;
//     private C1: tf.Tensor2D;
//     private C2: tf.Tensor2D;
//     private C3: tf.Tensor2D;
//     private C4: tf.Tensor2D;
//     private C5: tf.Tensor2D;

//     private B0: tf.Tensor2D;
//     // private B1: tf.Tensor2D;

//     private nActivation: tf.Variable;
//     private nPotential: tf.Variable;

//     // private minW: number = -10.0; //-5.0;
//     // private maxW: number = 10.0; //5.0;
//     // private minB: number = -10; //-5.0;
//     // private maxB: number = 10; //5.0;

//     // private colIdx = 0;

//     constructor(
//         w_arr: number[][][],
//         // mask_arr: number[][][],
//         // dropOut: boolean
//     ) {
//         // if (dropOut) {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[0]));
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[1]));
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)}).mul(tf.tensor2d(mask_arr[2]));

//         //     // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxB - this.minB).add(this.minB)}).mul(tf.tensor2d(mask_arr[3]));
//         // } else {
//         //     this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         //     this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});

//         // }
//         // this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2]).mul(this.maxW - this.minW).add(this.minW)});
//         // this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3]).mul(this.maxW - this.minW).add(this.minW)});

//         // this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[4]).mul(this.maxB - this.minB).add(this.minB)});

//         this.C0 = tf.tidy(() => {return tf.tensor2d(w_arr[0])});
//         this.C1 = tf.tidy(() => {return tf.tensor2d(w_arr[1])});
//         this.C2 = tf.tidy(() => {return tf.tensor2d(w_arr[2])});
//         this.C3 = tf.tidy(() => {return tf.tensor2d(w_arr[3])});
//         this.C4 = tf.tidy(() => {return tf.tensor2d(w_arr[4])});
//         this.C5 = tf.tidy(() => {return tf.tensor2d(w_arr[5])});

//         this.B0 = tf.tidy(() => {return tf.tensor2d(w_arr[6])});
//         // this.B1 = tf.tidy(() => {return tf.tensor2d(w_arr[7])});
        
//         this.nPotential = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});
//         this.nActivation = tf.tidy(() => {return tf.variable(tf.zerosLike(this.C0))});

//         // tf.setBackend('cpu');
//         // console.log(`TF backend: ${tf.getBackend()}`);
//     }

//     forward(input: number[]): number[] {
//         // const mem = tf.memory();
//         // console.log(`TF numTensors: ${mem.numTensors} numDataBuffers: ${mem.numDataBuffers} numBytes: ${mem.numBytes}`);

//         // console.log(`nPot: ${this.nPotential.bufferSync().get(0)}, ${this.nPotential.bufferSync().get(1)}, ${this.nPotential.bufferSync().get(2)}, ...`);

//         return tf.tidy(() => {
//             // const in_vector = tf.zerosLike(this.C0);
//             // const nP_buff = this.nPotential.bufferSync();
//             // for (let i = 0; i < input.length; i++) {
//             //     const iVal = input[i]; // / 10.0;
//             //     // nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//             //     nP_buff.set(iVal, i, this.colIdx);
//             // }
//             // const nP = nP_buff.toTensor();
//             const nP_buff = this.nPotential.bufferSync() as tf.TensorBuffer<tf.Rank.R2>;
            
//             for (let i = 0; i < nP_buff.shape[0]; i++) {
//                 for (let j = 0; j < input.length; j++) {
//                     const iVal = input[j]; // / 10.0;
//                     // nP_buff.set(iVal + nP_buff.get(i, this.colIdx), i, this.colIdx);
//                     nP_buff.set(iVal, i, j);
//                     // nP_buff.set(iVal, i, this.colIdx);
//                 }
//             }
//             let nP = nP_buff.toTensor();

//             // const W0 = this.nActivation.matMul(this.C0).tanh();
//             // const W1 = this.nActivation.matMul(this.C1).tanh();
//             // const deltaP = W1.matMul(this.nActivation.matMul(W0));
//             const deltaP = this.C1.matMul(this.nActivation.matMul(this.C0));

//             // const W2 = this.nActivation.matMul(this.C2).tanh();
//             // const W3 = this.nActivation.matMul(this.C3).tanh();
//             // const deltaP2 = W3.matMul(this.nActivation.matMul(W2));
//             const deltaP2 = this.C3.matMul(this.nActivation.matMul(this.C2));

//             const deltaP3 = this.C5.matMul(this.nActivation.matMul(this.C4));
            
//             // this.nPotential.assign(this.nPotential.add(nP.add(deltaP.add(deltaP2))));
//             // this.nActivation.assign(this.nPotential.add(this.B0).tanh().relu()); //.sigmoid()); //.tanh().relu()); //.sigmoid());
//             // this.nPotential.assign(this.nPotential.mul(tf.scalar(1).sub(this.nActivation)).mul(tf.scalar(0.9)));
//             // const r = W3.matMul(this.nActivation.matMul(W2)).tanh().relu(); //.sigmoid();
//             // this.nPotential.assign(this.nPotential.mul(r));

//             nP = nP.add(deltaP.add(deltaP2).add(deltaP3));
//             this.nActivation.assign(nP.add(this.B0).tanh().relu());

//             const out = this.nActivation.slice([0, this.nActivation.shape[1]! - 3], [-1, 3]).arraySync() as number[][];

//             return out[0];
//         });
//     }

//     dispose() {
//         tf.dispose([this.C0, this.C1, this.C2, this.C3, this.C4, this.C5, this.B0, this.nPotential, this.nActivation]);
//     }
// }