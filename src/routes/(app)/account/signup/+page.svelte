<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '../../../../lib/firebase/firebase.client';
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
  } from 'firebase/auth';
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import * as Card from "$lib/components/ui/card";
  import Button from "$lib/components/ui/button/button.svelte";
  import { goto } from '$app/navigation';

 
  let email = '';
  let password = '';
  
  let successMessage = '';
  let errorMessage = '';

  async function signUp() {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // goto('/account/login');
      successMessage = 'Signup successful!';
      errorMessage = ''; //clear any previous error messages
    } catch (error) {
      errorMessage = error.message;
      successMessage = '';
    }
  }
  
  onMount(() => {
    onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, you can redirect or enable certain UI elements
    } else {
      // User is signed out
    }
    })
  });
</script>

<div class="flex flex-col p-4 gap-4 items-center justify-center">

    
      <Card.Root class="w-full max-w-sm">
        <Card.Header>
          <Card.Title>Sign In</Card.Title>
          <!-- <Card.Description>Edit account information</Card.Description> -->
        </Card.Header>
        <Card.Content class="grid gap-4">
            <div class="grid w-full max-w-sm items-center gap-1.5">
                <Label for="email">Email</Label>
                <Input type="email" id="email" bind:value={email} placeholder="Email" />
            </div>


            <!-- <div class="grid gap-4 rounded-md border p-4"> -->

                <!-- <p class="text-sm font-medium leading-none">Change password</p> -->

                <!-- <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="oldpassword">Old Password</Label>
                    <Input type="oldpassword" id="oldpassword" placeholder="" />
                </div>
            -->
                <div class="grid w-full max-w-sm items-center gap-1.5">
                    <Label for="password">Password</Label>
                    <Input type="password" id="password" bind:value={password} placeholder="Password" />
                </div>
            <!-- </div> -->

        </Card.Content>
        <Card.Footer class="flex justify-between">
            <Button on:click={signUp}>Sign Up</Button>
            <!-- <Button on:click={logIn}>Log In</Button>
            <Button on:click={logOut}>Log Out</Button> -->
        </Card.Footer>
      </Card.Root>

    {#if successMessage}
      <div class="success">{successMessage}</div>
    {/if}
    {#if errorMessage}
      <div class="error">{errorMessage}</div>
    {/if}
</div>


  