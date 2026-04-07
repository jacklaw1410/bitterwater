<script lang="ts">
  interface Props {
    message?: string;
    loading?: boolean;
  }

  let { message = "Processing image...", loading = false }: Props = $props();
</script>

<div class={['loading-overlay', loading ? 'loading' : '']} role="status" aria-live="polite">
  <div class="spinner"></div>
  <p>{message}</p>
</div>

<style>
  .loading-overlay {
    background: var(--surface-overlay);
    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-16);
    border-radius: var(--radius-lg);
  }

  .loading-overlay.loading {
    display: flex;
  }

  .loading-overlay > .spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid var(--border-default);
    border-top-color: var(--border-focus);
    border-radius: var(--radius-full);
    animation: spin 0.8s linear infinite;
    margin-top: var(--space-16);
  }

  .loading-overlay >  p {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--text-secondary);
    margin-bottom: var(--space-16);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
