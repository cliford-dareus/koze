class AudioProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];

    for (let channel = 0; channel < output.length; ++channel) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];

      for (let i = 0; i < outputChannel.length; ++i) {
        // Here you can process your audio data
        outputChannel[i] = inputChannel[i];
      }
    }

    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
