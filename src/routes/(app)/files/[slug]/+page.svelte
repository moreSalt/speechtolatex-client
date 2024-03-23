<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Separator } from "$lib/components/ui/separator";
    import { Input } from "$lib/components/ui/input";
    import * as Collapsible from "$lib/components/ui/collapsible";
    import { Sun, Moon, CaretSort } from "svelte-radix";
    import { Progress } from "$lib/components/ui/progress";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import Recorder from "$lib/components/ui/recorder.svelte";
    import * as Card from "$lib/components/ui/card";
    import { page } from "$app/stores";
    import { Badge } from "$lib/components/ui/badge";
    import * as Resizable from "$lib/components/ui/resizable";
    import { Textarea } from "$lib/components/ui/textarea";
    import * as Menubar from "$lib/components/ui/menubar/index.js";
    import Reload from "svelte-radix/Reload.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as ContextMenu from "$lib/components/ui/context-menu/index.js";
    // import PdfViewer from 'svelte-pdf';
    import { PdfViewer } from "svelte-pdf-simple";

    import examplePdf from "$lib/assets/example.pdf";

    const env = process.env.NODE_ENV || "development";

    let showBookmarks = false;
    let showFullURLs = true;

    let value = "pedro";

    let latexText = "";
    let notPlaying = false;

    // Speech to text
    let stt =
        "It's good, right? This is absolutely beautiful. Thank you. Thank you, Christopher. What do you think of this one? I am... You can do better. I think I can do better.";

    // Text to latex
    let ttl = "";

    // Document text
    $: doc = `${ttl}`;

    // false until voice to latex is completed
    let initialized = false;

    // true if audio is being converted to latex
    let converting = false;

    // The value on the right hand / rendered side
    let render =
        "Dehydration is your worst enemy. Drink up while this page loads.";

    // Content of a dialog, changes as can't figure out how to connect one dialog trigger to one content
    let dialogContent = "";

    let dialogTitle = "";

    // Bypass uploading audio
    if (env === "development" && true) {
        ttl =
            "If the sky is blue, then it is not raining.\n\n\\begin{equation}\n\\text{Sky is blue} \\Rightarrow \\text{Not raining}\n\\end{equation}";
        initialized = true;
    }

    let formData: FormData | null;

    let bookmarks = false;
    let fullUrls = true;

    const profileRadioValue = "benoit";

    // Handle keypresses
    const onKeyDown = async (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            // render = doc
            handleRender();
        }
    };

    // Handles all of rendering latex to pdf
    async function handleRender() {
        try {
            render = doc;
        } catch (error) {
            console.log(error);
        }
    }

    // Convert speech to text
    async function getSTT() {
        const response = await fetch("/api/speechtotext", {
            method: "POST",
            body: formData,
        });

        const body = await response.json();

        if (response.status !== 201 || body.error) {
            throw new Error(body.message);
        }

        return body.text;
    }

    // Convert text to latex
    async function getTTL() {
        const response = await fetch("/api/texttolatex", {
            method: "POST",
            body: JSON.stringify({
                text: stt,
            }),
        });

        const body = await response.json();

        if (response.status !== 201 || body.error) {
            throw new Error(body.message);
        }

        return body.latex;
    }

    let audio: any;

    // Handles the whole process of speech to latex
    async function handleSubmit(event: {
        currentTarget: EventTarget & HTMLFormElement;
    }) {
        formData = new FormData(event.currentTarget);
        converting = true;
        // // Speech to text, with a toast
        await toast.promise(getSTT, {
            loading: "Converting speech to text...",
            success: (data) => {
                stt = data;

                // Text to Latex, done within the other toast because the first one resolves before it actually comepltes
                toast.promise(getTTL, {
                    loading: "Converting text to Latex...",
                    success: (data) => {
                        ttl = data;
                        converting = false;
                        return "Text has been converted to Latex";
                    },
                    error: (data) => {
                        converting = false;
                        return `${data}`;
                    },
                });
                converting = false;
                initialized = true;
                return "Speech has been converted to text";
            },
            error: (data) => {
                converting = false;
                return `${data}`;
            },
        });
    }
</script>


    <Dialog.Root >
        <!-- ADD A CONTEXT MENU TO BE ABLE TO RIGHT CLICK ON SHIT -->
        <div
            class="flex flex-col grow gap-4 items-center"
        >
            <div class="self-start flex items-center space-x-4">
                <h1
                    class="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl"
                >
                    File: {$page.params.slug}
                </h1>
                {#if !initialized}
                    <Badge>new</Badge>
                {/if}
            </div>
    
            <!-- <p class="text-md text-muted-foreground self-start">
            To start please upload an audio file or record your own audio.
        </p> -->
    
            {#if initialized}
                <Menubar.Root class="self-start">
                    <Menubar.Menu>
                        <Menubar.Trigger>File</Menubar.Trigger>
                        <Menubar.Content>
                            <Menubar.Item on:click={handleRender}>
                                Render
                                <Menubar.Shortcut>⌘S</Menubar.Shortcut>
                            </Menubar.Item>
                            <Menubar.Item>
                                <Dialog.Trigger
                                    class="w-full text-start"
                                    on:click={() => {
                                        dialogContent = `${stt}`;
                                        dialogTitle = "Speech to Text";
                                    }}>Speech to Text</Dialog.Trigger
                                >
                            </Menubar.Item>
                            <Menubar.Item>
                                <Dialog.Trigger
                                    class="w-full text-start"
                                    on:click={() => {
                                        dialogContent = `${ttl}`;
                                        dialogTitle = "Text to Latex";
                                    }}>Text to Latex</Dialog.Trigger
                                >
                            </Menubar.Item>
                            <Menubar.Separator />
                            <Menubar.Item>Share</Menubar.Item>
                            <Menubar.Separator />
                            <Menubar.Item>Print</Menubar.Item>
                        </Menubar.Content>
                    </Menubar.Menu>
                    <Menubar.Menu>
                        <Menubar.Trigger>Edit</Menubar.Trigger>
                        <Menubar.Content>
                            <Menubar.Item>
                                New Tab
                                <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                            </Menubar.Item>
                            <Menubar.Item>New Window</Menubar.Item>
                            <Menubar.Separator />
                            <Menubar.Item>Share</Menubar.Item>
                            <Menubar.Separator />
                            <Menubar.Item>Print</Menubar.Item>
                        </Menubar.Content>
                    </Menubar.Menu>
                </Menubar.Root>
    

                        <!-- CONTENT -->
                        <!-- !TODO: change from horizontal to vertical for mobile -->
                        <Resizable.PaneGroup direction="horizontal" class="h-full flex flex-col grow">
                            <!-- LEFT SIDE -->
                            <Resizable.Pane class="flex w-full   pr-8">
                                <Textarea bind:value={doc} class="min-h-96 grow text-xs" />
                            </Resizable.Pane>

                            
                            <Resizable.Handle class="border-3" />
    
                            <!-- RIGHT SIDE -->
                            <Resizable.Pane
                                class="flex w-full items-center justify-center pl-8"
                            >
                                <iframe
                                    title="latex pdf"
                                    src={examplePdf}
                                    frameborder="0"
                                    class="w-full h-full rounded"
                                ></iframe>
                            </Resizable.Pane>
                        </Resizable.PaneGroup>
    
                        <!-- END OF CONTENT -->

            {:else}
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="w-full sm:max-w-lg"
                >
                    <Card.Root class="w-full sm:max-w-lg">
                        <Card.Header>
                            <Card.Title>Upload Audio</Card.Title>
                            <Card.Description
                                >You won't regret this, pinky promise.</Card.Description
                            >
                        </Card.Header>
                        <Card.Content
                            class="flex w-full justify-between items-center"
                        >
                            <Input
                                id="audio"
                                name="file"
                                type="file"
                                bind:value={audio}
                                required
                            />
                        </Card.Content>
                        <Card.Footer>
                            <Button
                                class="w-full"
                                type="submit"
                                disabled={converting}
                            >
                                {#if converting}
                                    <Reload class="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                {:else}
                                    Submit
                                {/if}
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </form>
            {/if}
        </div>
        
        <Dialog.Content>
            <Dialog.Header>
                <Dialog.Title>{dialogTitle}</Dialog.Title>
                <Dialog.Description>
                    <Textarea disabled value={dialogContent} class="min-h-36 mt-4"
                    ></Textarea>
                </Dialog.Description>
            </Dialog.Header>
        </Dialog.Content>
    </Dialog.Root>
<!-- </div> -->

