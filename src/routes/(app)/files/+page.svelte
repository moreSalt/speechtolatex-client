	
<script lang="ts">
    import { toast } from "svelte-sonner";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table";
    import { Trash } from "svelte-radix";

    let data = [
        {
            id: "1",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "2",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "3",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "4",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "5",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "6",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
        {
            id: "7",
            date: new Date().toISOString(),
            summary: "lorem ipsum"
        },
    ]

    async function deleteElement(id: string) {
        if (!id) {
            throw new Error("id must not be blank")
        }

        const len = data.length

        if (len === 0) {
            throw new Error("No files found")
        }
        data = data.filter(e => e.id !== id)
        
        if (data.length === len) {
            throw new Error("Number of files stayed the same, something went wrong")
        }

        return id
    }

    function handleDelete(id: string) {
        toast.promise(() => deleteElement(id), {
            loading: "Deleting file...",
            success: (data) => {
                return `Deleted file ${data}`
            },
            error: (data) => {
                return `Error deleting file: ${data}`
            }
        })
    }



  </script>
  
<div class="flex flex-col space-y-4 select-none">
    <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Files</h1>
    	
    <p class="leading-7 [&:not(:first-child)]:mt-6">
        Lorem ipsum
    </p>

    
    <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head class="w-[200px]">Date</Table.Head>
            <Table.Head>ID</Table.Head>
            <Table.Head>Summary</Table.Head>
            <Table.Head class="text-right"><Button size="sm" href="api/files/create">Create</Button></Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each data as row, index}
            <Table.Row>
                <Table.Cell>{row.date.split("T")[0]}</Table.Cell>
                <Table.Cell>{row.id}</Table.Cell>
                <Table.Cell>{row.summary}</Table.Cell>
                <Table.Cell class="text-right flex justify-end space-x-2">
                    <Button variant="secondary" href="files/{row.id}">Open</Button>
                    <Button variant="destructive" size="icon" on:click={() => {
                        handleDelete(row.id)
                    }}>
                        <Trash class="h-4 w-4"/>
                    </Button>
                
                </Table.Cell>
              </Table.Row>
            {/each}
        </Table.Body>
      </Table.Root>
</div>
  	

  
  