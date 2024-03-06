<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import { Sun, Moon, CaretSort } from "svelte-radix";
    import { Progress } from "$lib/components/ui/progress";
    import { toast } from "svelte-sonner";
    import { onMount } from 'svelte'
    import Recorder from "$lib/components/ui/recorder.svelte";
    import * as Card from "$lib/components/ui/card";
    import { page } from '$app/stores';
    import { Badge } from "$lib/components/ui/badge";

    let exampleLatex = "If the sky is blue, then it is not raining.\n\n\\begin{equation}\n\\text{Sky is blue} \\Rightarrow \\text{Not raining}\n\\end{equation}"

    let latexText = ""
    let notPlaying = false
    let stt = ""
    let ttl = ""
    let formData: FormData | null
    let enabled = false;
    let progress = 0
    let fileName = ""

    let state = "new"


    async function getSTT() {
        await console.log(formData)
        const response = await fetch("/api/speechtotext", {
            method: "POST",
            body: formData
        })

        const body = await response.json()

        if (response.status !== 201 || body.error) {
            throw new Error(body.message)
        }

        return body.text
    }

    async function getTTL () {
        const response = await fetch("/api/texttolatex", {
            method: "POST",
            body: JSON.stringify({
                text: stt
            })
        })

        const body = await response.json()

        if (response.status !== 201 || body.error) {
            throw new Error(body.message)
        }
        
        return body.latex
    }

    let audio: any;
    async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
        enabled = true
        formData = new FormData(event.currentTarget)
        state = "converting"

        // // Speech to text, with a toast
        await toast.promise(getSTT, {
            loading: "Converting speech to text...",
            success: (data) => {
                progress = 50
                stt = data
                
                // Text to Latex, done within the other toast because the first one resolves before it actually comepltes
                toast.promise(getTTL, {
                    loading: "Converting text to Latex...",
                    success: (data) => {
                        progress = 100
                        ttl = data
                        state = "ready"
                        return "Text has been converted to Latex"
                    },
                    error: (data) => {
                        enabled = false
                        state = "new"
                        return `${data}`
                    }
                })
                return "Speech has been converted to text"
            },
            error: (data) => {
                enabled = false
                state = "new"
                return `${data}`
            }
        })
        
    }




</script>


<div class="flex flex-col p-4 gap-2 items-center justify-center">

    	
    <div class="self-start flex items-center space-x-4">
        <h1 class="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-5xl text-green">
            File: {$page.params.slug}
        </h1>
        <Badge>{state}</Badge>
    </div>
    	
    <p class="text-md text-muted-foreground self-start">
        To start please upload an audio file or record your own audio.
    </p>
  
  
  
  
    {#if enabled}

        <h2 class="w-full max-w-xl sm:max-w-2xl text-left font-semibold">Converting audio: {progress !== 100 ? `${progress}%` : "Completed"}</h2>
        <Progress value={progress} max={100} class="w-full max-w-xl sm:max-w-2xl" />

        {#if stt}
            <Collapsible.Root class="w-full max-w-xl sm:max-w-2xl space-y-2">

                <div class="flex items-center justify-between space-x-4">
                    <h4 class="text-sm font-semibold">Speech to text response</h4>
                    <Collapsible.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" size="sm" class="w-9 p-0">
                        <CaretSort class="h-4 w-4" />
                        <span class="sr-only">Speech to text response</span>
                    </Button>
                    </Collapsible.Trigger>
                </div>


                <Collapsible.Content class="space-y-2">
                        <div class="rounded-md border px-4 py-3 font-mono text-xs select-all">
                            {stt}
                        </div>
                </Collapsible.Content>
            </Collapsible.Root>
        {/if}

        {#if ttl}
            <Collapsible.Root class="w-full max-w-xl sm:max-w-2xl space-y-2">

                <div class="flex items-center justify-between space-x-4">
                    <h4 class="text-sm font-semibold">Text to Latex response</h4>
                    <Collapsible.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" size="sm" class="w-9 p-0">
                        <CaretSort class="h-4 w-4" />
                        <span class="sr-only">Text to Latex response</span>
                    </Button>
                    </Collapsible.Trigger>
                </div>


                <Collapsible.Content class="space-y-2">
                        <div class="rounded-md border px-4 py-3 font-mono text-xs select-all">
                            {ttl}
                        </div>
                </Collapsible.Content>
            </Collapsible.Root>
        {/if}

        {#if ttl && stt}
            <Button on:click={() => {
                ttl = ""
                stt = ""
                enabled = false
                progress = 0
                state = "new"
            }} variant="outline">
                Reset
            </Button>
        {/if}
    {:else} 
    

    <form on:submit|preventDefault={handleSubmit} class="w-full sm:max-w-lg">
        <Card.Root class="w-full sm:max-w-lg">
            <Card.Header>
                <Card.Title>Input</Card.Title>
                <Card.Description>Either record or upload an audio file</Card.Description>
            </Card.Header>
            <Card.Content class="flex w-full justify-between items-center">
                    <Input id="audio" name="file" type="file" bind:value={audio} />
            </Card.Content>
            <Card.Footer>
                <Button class="w-full" type="submit">Submit</Button>
            </Card.Footer>
        </Card.Root>
    </form>


     
    {/if}

</div>