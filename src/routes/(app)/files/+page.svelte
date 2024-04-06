<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { onMount } from "svelte";
    import type { DefaultApiResponse, File } from "$lib/types/api";
    import { toast } from "svelte-sonner";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { PUBLIC_API_URL } from "$env/static/public";

    export let data;
    let mounted = false;

    let files: File[] = [];

    async function deleteFile(id: number) {
        const toastId = await toast.loading("Deleting file...");
        try {
            const res = await fetch(`${PUBLIC_API_URL}/files/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
            if (res.status !== 200)
                throw new Error("unexpected status code: " + res.status);

            await getFiles();
            await toast.success("Deleted file", { id: toastId });
        } catch (err) {
            await console.error(err);
            toast.success(`Error deleting file: ${err}`, { id: toastId });
        }
    }

    async function getFiles() {
        try {
            const res = await fetch(`${PUBLIC_API_URL}/files`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                },
            });
            if (res.status !== 200)
                throw new Error("Unexpected status code " + res.status);
            const body: File[] = JSON.parse(JSON.stringify(await res.json()));
            files = body;
        } catch (err) {
            await console.error(err);
        }
    }

    async function createFile() {
        const toastId = toast.loading("Creating new file...");
        try {
            const res = await fetch(`${PUBLIC_API_URL}/files`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${data.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "New file",
                    text: "",
                    latex: "",
                }),
            });

            const body: DefaultApiResponse = JSON.parse(
                JSON.stringify(await res.json())
            );
            if (res.status !== 201)
                throw new Error(`${body.error ? body.error : res.statusText}`);

            await getFiles();
            await toast.success("Created new file", { id: toastId });
        } catch (err) {
            await console.error(err);
            toast.error(`Error creating new file: ${err}`, { id: toastId });
        }
    }

    onMount(async () => {
        await getFiles();
        mounted = true;
    });
</script>

<div class="flex flex-col space-y-4 select-none">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Files
    </h1>
    <Table.Root>
        <Table.Header>
            <Table.Row>
                <Table.Head class="w-sm">Date</Table.Head>
                <Table.Head>Title</Table.Head>
                <Table.Head class="text-right"
                    ><Button
                        size="sm"
                        on:click={async () => {
                            await createFile();
                        }}>Create</Button
                    ></Table.Head
                >
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#if mounted}
                {#each files as file, index}
                    <Table.Row>
                        <Table.Cell>{file.created}</Table.Cell>
                        <Table.Cell>{file.title}</Table.Cell>
                        <Table.Cell
                            class="text-right flex justify-end space-x-2"
                        >
                            <Button
                                variant="secondary"
                                size="sm"
                                href="files/{file.id}">Open</Button
                            >
                            <Button
                                variant="destructive"
                                size="sm"
                                on:click={() => {
                                    // handleDelete(file.id)
                                    deleteFile(file.id);
                                }}
                            >
                                Delete
                            </Button>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            {:else}
                {#each [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] as i}
                    <Table.Row>
                        <Table.Cell>
                            <Skeleton class="h-5 w-[200px] rounded-full" />
                        </Table.Cell>
                        <Table.Cell>
                            <Skeleton class="h-5 w-[200px] rounded-full" />
                        </Table.Cell>
                        <Table.Cell
                            class="text-right flex justify-end space-x-2"
                        >
                            <Skeleton class="h-5 w-[100px] rounded-full" />
                            <Skeleton class="h-5 w-[100px] rounded-full" />
                        </Table.Cell>
                    </Table.Row>
                {/each}
            {/if}
        </Table.Body>
    </Table.Root>
</div>
