import { AudioNode } from './audio-node';

export interface AnalysisNode extends AudioNode {
  analysisDataLength: number;
  getAnalysisData(dataArray: Float32Array): Float32Array;
}
