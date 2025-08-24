import { registerPlugin } from '@capacitor/core';

interface MistralPlugin {
  query(options: { prompt: string }): Promise<{ response: string }>;
}

const Mistral = registerPlugin<MistralPlugin>('Mistral');
export default Mistral;
