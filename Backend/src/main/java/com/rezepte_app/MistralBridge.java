/*
package com.rezepte_app;

public class MistralBridge {
    private Context context;

    public MistralBridge(Context context) {
        this.context = context;
    }

    @PluginMethod
    public void query(Promise promise, String prompt) {
        try {
            MistralClient client = new MistralClient("YOUR_API_KEY");
            CompletionRequest request = new CompletionRequest.Builder()
                    .setModel("mistral-tiny")
                    .setPrompt(prompt)
                    .build();

            String response = client.complete(request);
            promise.resolve(response);
        } catch (Exception e) {
            promise.reject("Error", e);
        }
    }
}
*/
