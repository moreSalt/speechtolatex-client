<script lang="ts">
    import { onMount } from "svelte";
    import { Stop, Play } from "svelte-radix"
    import { Button } from "$lib/components/ui/button";
    let enabled = false;

    let mediaRecorder = {}
    let chunks: Blob[] = []

    onMount(async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            
                mediaRecorder = new MediaRecorder(stream)
                mediaRecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                };
                mediaRecorder.onstop = async () => {
                    const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
                    console.log(blob)
                }

            // await console.log(mediaRecorder)
            } catch (error) {
                console.error(error)
            }
        }
    });

    let record = async () => {
        if (!mediaRecorder) {
            console.log("Media recorder not set")
            return
        }
        if (enabled) {
           await mediaRecorder.stop()
        } else {
            await mediaRecorder.start()
        }
        enabled = !enabled
    }


</script>

<Button
    variant="outline"
    size="icon"
    on:click={record}
>
    {#if enabled}
        <Stop className="h-4 w-4" />
    {:else}
        <Play className="h-4 w-4" />
    {/if}
</Button>
