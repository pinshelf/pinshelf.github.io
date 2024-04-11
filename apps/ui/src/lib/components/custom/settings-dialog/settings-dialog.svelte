<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog";
    import { onMount } from "svelte";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
  
    let token = "";
    let error = "";
    let dialog: Dialog.Root;
  
    onMount(() => {
      const storedToken = localStorage.getItem("huggingFaceToken");
      if (storedToken) {
        token = storedToken;
      }
    });
  
    function saveToken() {
      if (token.trim() === "") {
        error = "Please enter a valid token.";
        return;
      }
  
      localStorage.setItem("huggingFaceToken", token);
      error = "";
      dialog.close();
    }
  </script>
  
  <Dialog.Root bind:this={dialog}>
    <Dialog.Trigger>AI Settings</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Hugging Face Token</Dialog.Title>
        <Dialog.Description>
          Please enter your Hugging Face READ access token to enable AI features.
        </Dialog.Description>
      </Dialog.Header>
      <div class="p-2">
        <div class="grid w-full items-center gap-1.5 pb-3">
          <Label for="hf-token">Token</Label>
          <Input
            id="hf-token"
            type="password"
            class="font-mono"
            placeholder="••••••••••••••••"
            bind:value={token}
          />
          <p class="text-sm text-muted-foreground">Enter your Hugging Face token.</p>
        </div>
  
        {#if error !== ""}
          <div class="pt-1.5 h-6">
            <span class="text-red-600">Failed: {error}</span>
          </div>
        {:else}
          <div class="pt-1.5 h-6"></div>
        {/if}
  
        <div class="pt-3 flex justify-end">
          <Button variant="secondary" on:click={saveToken}>Save</Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Root>