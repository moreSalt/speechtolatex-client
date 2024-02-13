<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import { ChevronsUpDown } from "lucide-svelte";
    import { Sun, Moon, Play, Stop, NotionLogo } from "radix-icons-svelte";
    import { toggleMode } from "mode-watcher";
    import { Progress } from "$lib/components/ui/progress";
    import { toast } from "svelte-sonner";
    import { onMount } from 'svelte'
    import Recorder from "$lib/components/ui/recorder.svelte";


    let exampleLatex = "If the sky is blue, then it is not raining.\n\n\\begin{equation}\n\\text{Sky is blue} \\Rightarrow \\text{Not raining}\n\\end{equation}"

    let latexText = ""
    let notPlaying = false
    let stt = ""
    let ttl = ""
    let formData: FormData | null
    let enabled = false;
    let progress = 0
    let fileName = ""


    async function getSTT() {
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


    async function handleSubmit(event: { currentTarget: EventTarget & HTMLFormElement }) {
        enabled = true
        formData = new FormData(event.currentTarget)


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
                        return "Text has been converted to Latex"
                    },
                    error: (data) => {
                        return `${data}`
                    }
                })
                return "Speech has been converted to text"
            },
            error: (data) => {
                return `${data}`
            }
        })
        
    }




</script>


<div class="flex flex-col justify-between p-4 gap-4 items-center justify-center">
    <Button on:click={toggleMode} variant="outline" size="icon">
        <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Toggle theme</span>
    </Button>

    <Recorder />

    {#if enabled}

        <h2 class="w-full max-w-xl sm:max-w-2xl text-left font-semibold">Converting audio: {progress !== 100 ? `${progress}%` : "Completed"}</h2>
        <Progress value={progress} max={100} class="w-full max-w-xl sm:max-w-2xl" />

        {#if stt}
            <Collapsible.Root class="w-full max-w-xl sm:max-w-2xl space-y-2">

                <div class="flex items-center justify-between space-x-4">
                    <h4 class="text-sm font-semibold">Speech to text response</h4>
                    <Collapsible.Trigger asChild let:builder>
                    <Button builders={[builder]} variant="outline" size="sm" class="w-9 p-0">
                        <ChevronsUpDown class="h-4 w-4" />
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
                        <ChevronsUpDown class="h-4 w-4" />
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
            }} variant="outline">
                Reset
            </Button>
        {/if}
    {:else} 
        <form class="flex w-full max-w-xl sm:max-w-2xl items-center space-x-2" on:submit|preventDefault={handleSubmit}>
            <Input id="audio" name="file" type="file" />
            <Button type="submit" variant="outline">Submit</Button>
        </form>
    {/if}

    <!-- <div class="text-white w-full max-w-xl border h-64">
        {@html output}
    </div> -->


</div>


