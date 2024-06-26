<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { toast } from "svelte-sonner";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import { page } from "$app/stores";
    import { Badge } from "$lib/components/ui/badge";
    import * as Resizable from "$lib/components/ui/resizable";
    import { Textarea } from "$lib/components/ui/textarea";
    import Reload from "svelte-radix/Reload.svelte";
    import type { File, DefaultApiResponse } from "$lib/types/api";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { PUBLIC_API_URL } from "$env/static/public";


    const env = process.env.NODE_ENV || "development";
    export let data;
    // Speech to text
    let stt =
        "It's good, right? This is absolutely beautiful. Thank you. Thank you, Christopher. What do you think of this one? I am... You can do better. I think I can do better.";

    // Text to latex
    let ttl = "";

    // false until voice to latex is completed
    let initialized = false;

    // true if audio is being converted to latex
    let converting = false;

    // Binded value for mp3 file
    let audio: any;


    // table row
    let file: File;

    // URL of the pdf, access handled within the python api
    let pdfUrl: string = "";

    // Bypass uploading audio
    if (env === "development" && false) {
        ttl =
            "If the sky is blue, then it is not raining.\n\n\\begin{equation}\n\\text{Sky is blue} \\Rightarrow \\text{Not raining}\n\\end{equation}";
        initialized = true;
    }

    let formData: FormData | null;


    // Convert speech to text
    async function getSTT() {
        try {
            const res = await fetch("/api/speechtotext", {
                method: "POST",
                body: formData,
            });

            const body = await res.json();

            if (res.status !== 201 || body.error) {
                throw new Error(body.message);
            }

            stt = body.text;
            return {
                text: body.text,
                error: null,
            };
        } catch (err) {
            await console.error(err);
            return {
                text: "",
                error: `${err}`,
            };
        }
    }

    // Convert text to latex
    async function getTTL() {
        try {
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

            ttl = body.latex;
            return {
                latex: body.latex,
                error: null,
            };
        } catch (err) {
            await console.error(err);
            return {
                latex: "",
                error: `${err}`,
            };
        }
    }

    // Update the rows data
    async function updateRow(title: string, text: string, latex: string) {
        try {

            // !TODO: make this server side?
            if (!latex.includes("documentclass{article}")) {
                latex = `\\documentclass{article}\\begin{document}${latex}\\end{document}`
            }

            const res = await fetch(`${PUBLIC_API_URL}/files/${$page.params.slug}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    latex,
                    text
                })
            })
            const body = await res.json()
            if (res.status !== 200) throw new Error(body.error ? body.error : res.statusText)
        } catch (err) {
            await console.error(err);
            return `${err}`;
        }
    }

    // Handles all logic for taking a audio file and converting it into latex, along with updating the table row
    async function handleSubmit(event: {
        currentTarget: EventTarget & HTMLFormElement;
    }) {
        const toastId = toast.loading("Converting speech to text");
        converting = true;
        try {
            formData = new FormData(event.currentTarget);

            // Convert speech to text
            const textRes = await getSTT();
            if (textRes.error !== null) {
                throw new Error(textRes.error);
            }

            await toast.loading("Converting text to LaTeX", {
                id: toastId,
            });

            // Convert text to latex
            const latexRes = await getTTL();
            if (latexRes.error !== null) {
                throw new Error(latexRes.error);
            }

            await toast.loading("Updating", {
                id: toastId,
            });

            // Update db
            const updateRowErr = await updateRow(
                "Example title",
                textRes.text,
                latexRes.latex
            );
            if (updateRowErr) throw new Error(updateRowErr);

            await toast.loading("Fetching", {
                id: toastId,
            });

            // Fetch file
            const getFileErr = await getFile();
            if (getFileErr) throw new Error(getFileErr);

            // Update pdf
            await updatePdf()

            await getPdf()

            await toast.success("Successfully converted audio to LaTeX", {
                id: toastId,
            });
        } catch (err) {
            await console.error(err);
            await toast.error(`Error: ${err}`, {
                id: toastId,
            });
        }
        converting = false;
    }

    async function getFile() {
        try {

            const res = await fetch(`${PUBLIC_API_URL}/files/${$page.params.slug}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                }
            })


            const body: File = await res.json()

            // !TODO have an error response
            if (res.status != 200) throw new Error(res.statusText)
            file = body;

        } catch (err) {
            await console.error(err);
            return `${err}`;
        }
    }

    async function getPdf() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/storage/${$page.params.slug}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                }
            });

            const body: DefaultApiResponse = await res.json();

            if (res.status !== 200) {
                throw new Error(body.message);
            }

            pdfUrl = `${body.url}`
        } catch (error) {
            await console.error(error);
            return `${error}`;
        }
    }

    async function updatePdf() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/storage`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: parseInt($page.params.slug),
                    latex: file.latex,
                }),
            });

            const body: DefaultApiResponse = await res.json();

            if (res.status !== 201) {
                throw new Error(body.message);
            }

            // pdfUrl = `${body.url}`;
            // pdfUrl = ""
            pdfUrl = `${pdfUrl}`

        } catch (error) {
            await console.error(error);
            return `${error}`;
        }
    }

    async function handleSave() {
        const toastId = toast.loading("Saving file")
        try {

            if (!file || !file.text || !file.latex) throw new Error("File or it's contents undefined")
            // Update db
            const updateRowErr = await updateRow(
                file.title,
                file.text,
                file.latex
            );
            // if (updateRowErr) throw new Error(updateRowErr);

            // await toast.loading("Fetching", {
            //     id: toastId,
            // });

            // Fetch file
            const getFileErr = await getFile();
            if (getFileErr) throw new Error(getFileErr);

            // Update pdf
            await updatePdf()

            await getPdf()


            await toast.success("Saved file", {
                id: toastId,
            });
        } catch (error) {
            toast.error(`${error}`, {
                id: toastId
            })
        }
    }

    onMount(async () => {
        const err = await getFile();
        if (err) {
            toast.error(err);
        }

        const pdfErr = await getPdf();
        if (pdfErr) {
            toast.error(pdfErr);
        }

        initialized = true;
    });
</script>

<div class="flex flex-col grow gap-4 items-center">
    <div class="self-start flex items-center space-x-4">
        <h1
            class="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-3xl"
        >
            {#if file}
                <Input type="text" bind:value={file.title} class="max-w-xs" />
            {:else}
                Loading...
            {/if}
        </h1>
        {#if !file || !file.text || !file.latex}
            <Badge>new</Badge>
        {/if}
    </div>

    <Button class="self-start" size="sm" on:click={handleSave}>Save</Button>

    <!-- <p class="text-md text-muted-foreground self-start">
            To start please upload an audio file or record your own audio.
        </p> -->

    {#if initialized}
        {#if file && file.text && file.latex}
            <!-- CONTENT -->
            <!-- !TODO: change from horizontal to vertical for mobile -->
            <Resizable.PaneGroup
                direction="horizontal"
                class="h-full flex flex-col grow"
            >
                <!-- LEFT SIDE -->
                <Resizable.Pane class="flex w-full   pr-8">
                    <Textarea
                        bind:value={file.latex}
                        class="min-h-96 grow text-xs"
                    />
                </Resizable.Pane>

                <Resizable.Handle class="border-3" />

                <!-- RIGHT SIDE -->
                <Resizable.Pane
                    class="flex w-full items-center justify-center pl-8"
                >
                    <iframe
                        title="latex pdf"
                        src={pdfUrl}
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
    {:else}
        <div class="flex grow gap-8 w-full">
            <Skeleton class="w-full grow rounded" />
            <Skeleton class="w-full grow rounded" />
        </div>
    {/if}
</div>

