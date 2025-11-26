<script>
  export let thinkie;
  export let onClose;
</script>

<div class="insights-container">
  <div class="mb-6">
    <h2 class="text-3xl font-bold mb-3 text-gray-800">{thinkie.title}</h2>
    <div class="mb-4">
      <p class="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Proposed Scenario:</p>
      <p class="text-base text-gray-700 leading-relaxed">{thinkie.scenario}</p>
    </div>
    <div class="badge badge-primary badge-lg">{thinkie.insights.length} insights</div>
  </div>

  <div class="divider"></div>

  <div class="space-y-3">
    {#each thinkie.insights as insight, i}
      <div class="insight-card">
        <div class="insight-content">
          <div class="insight-number">{i + 1}</div>
          <p class="insight-text">{insight}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .insights-container {
    height: 100%;
    overflow-y: auto;
    padding-right: 1rem;
  }

  .insights-container::-webkit-scrollbar {
    width: 8px;
  }

  .insights-container::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .insights-container::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  .insights-container::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .insight-card {
    background: white;
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
  }

  .insight-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .insight-content {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .insight-number {
    flex-shrink: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .insight-text {
    flex: 1;
    color: #374151;
    font-size: 0.9375rem;
    line-height: 1.6;
    margin: 0;
  }
</style>
