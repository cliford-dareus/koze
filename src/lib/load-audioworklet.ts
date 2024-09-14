

const loadAudioWorklet = async (contextRef: any) => {
  if (contextRef.current) {
    try {
      await contextRef.current.audioWorklet.addModule("/audio-processor.js");
      console.log("AudioWorklet loaded successfully");
    } catch (error) {
      console.error("Failed to load AudioWorklet:", error);
    }
  } else {
    console.error("AudioWorklet is not supported in this browser");
  }
};

export default loadAudioWorklet;
