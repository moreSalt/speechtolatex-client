<script lang="ts">
    import { ModeWatcher } from "mode-watcher";
    import "../../app.css";
    import { dev } from '$app/environment';
    import { Toaster } from "$lib/components/ui/sonner";
    import { inject } from '@vercel/analytics';
    import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit"
    import Button from "$lib/components/ui/button/button.svelte";
    import { Sun, Moon } from "svelte-radix";
    import { toggleMode } from "mode-watcher";
    import { user, signOut, signIn } from '$lib/stores/auth';
    import { page } from '$app/stores';
    import { toast } from "svelte-sonner";
    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights()

    const pages = [
        {
            name: "home",
            location: "/"
        },
        {
            name: "files",
            location: "/files"
        }
    ]

    async function signOutHandler() {
        await signOut()
        await toast.info("You have been logged out")
    }
  </script>


  <ModeWatcher />
  <Toaster position="bottom-right" duration={2000}/>


<div class="min-h-screen flex flex-col">
    <nav class="w-full flex items-center gap-4 p-4 h-16 border-b mb-4 justify-between">

        <!-- Logo -->
        <h3>Text to Latex</h3>
    
    
        <!-- Pages -->
        <div class="flex items-center gap-4">
            {#each pages as page}
                <a
                    href="{page.location}"
                    class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary capitalize"
                >
                    {page.name}
                </a>
            {/each}
        </div>
    
    
    
    
        <!-- Darkmode switcher -->
    
    
        <!-- Account/signup -->
        <div class="flex gap-4 items-center select-none">
    
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun
                    class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                    class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
    
            {#if $user}

                <Button on:click={() => signOutHandler()}>Log out</Button>
            {:else}
                <Button on:click={() => signIn()}>Log in</Button>
            {/if}
        </div>
      </nav>
    
      <div class="p-4 flex flex-col grow">
        <slot />
      </div>
</div>