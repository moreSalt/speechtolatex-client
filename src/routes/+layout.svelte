<script>
    import { ModeWatcher } from "mode-watcher";
    import "../app.css";
    import { dev } from '$app/environment';
    import { Toaster } from "$lib/components/ui/sonner";
    import { inject } from '@vercel/analytics';
    import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit"
    inject({ mode: dev ? 'development' : 'production' });
    injectSpeedInsights()
  </script>


  <ModeWatcher />
  <!-- <Toaster position="top-right" duration={2000}/> -->
  <slot />