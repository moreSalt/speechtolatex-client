<script lang="ts">
    	
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
 


</script>

<div class="flex flex-col p-4 gap-4 items-center justify-center">

    
      <Card.Root class="w-full max-w-sm">
        <Card.Header>
          <Card.Title>Account</Card.Title>
          <Card.Description>Edit account information</Card.Description>
        </Card.Header>
        <Card.Content class="grid gap-4">
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="email">Email</Label>
                <Input type="email" id="email" placeholder="" />
            </div>


            <div class="grid gap-4 rounded-md border p-4">

                <p class="text-sm font-medium leading-none">Change password</p>

                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="oldpassword">Old Password</Label>
                    <Input type="oldpassword" id="oldpassword" placeholder="" />
                </div>
    
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="password">Password</Label>
                    <Input type="password" id="password" placeholder="" />
                </div>
            </div>

        </Card.Content>
        <Card.Footer class="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button class="">
                Save
              </Button>
        </Card.Footer>
      </Card.Root>
</div>


  