document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('calculatorForm');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsContainer = document.getElementById('resultsContainer');
    const btcThenValue = document.getElementById('btcThenValue');
    const btcNowValue = document.getElementById('btcNowValue');
    const diffValue = document.getElementById('diffValue');
    const diffIndicator = document.getElementById('diffIndicator');
    const diffCard = document.getElementById('diffCard');
    const chartOverlay = document.getElementById('chartOverlay');
    
    // Set max date to today
    const dateInput = document.getElementById('transactionDate');
    dateInput.max = new Date().toISOString().split('T')[0];
    dateInput.value = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // Default to 30 days ago
    
    let impactChart = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const usdAmount = document.getElementById('usdAmount').value;
        const targetDate = dateInput.value;
        
        if (!usdAmount || !targetDate) return;

        // Show loading state
        loadingIndicator.classList.remove('hidden');
        resultsContainer.classList.add('opacity-50');
        
        try {
            // Fetch calculation from backend
            const result = await ApiService.calculateImpact(usdAmount, targetDate);
            
            // Format and display results
            displayResults(result, Number(usdAmount));
            
            // Update chart
            updateChart(Number(usdAmount), result.btc_now, targetDate);
            
            // Hide overlay
            chartOverlay.style.opacity = '0';
            setTimeout(() => chartOverlay.classList.add('hidden'), 300);
            
        } catch (error) {
            alert('Error calculating impact: ' + error.message);
        } finally {
            // Hide loading state
            loadingIndicator.classList.add('hidden');
            resultsContainer.classList.remove('opacity-50');
        }
    });

    function displayResults(data, initialUsd) {
        // Format values
        btcThenValue.textContent = data.btc_then.toFixed(8);
        
        const formattedBtcNow = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(data.btc_now);
        
        btcNowValue.textContent = formattedBtcNow;
        
        const diffPercent = data.difference_percent;
        const formattedDiff = Math.abs(diffPercent).toFixed(2) + '%';
        
        // Update DOM based on positive/negative
        if (diffPercent > 0) {
            diffValue.textContent = '+' + formattedDiff;
            diffValue.classList.remove('text-red-400', 'text-white');
            diffValue.classList.add('text-green-400');
            
            diffIndicator.textContent = 'Profit';
            diffIndicator.classList.remove('bg-red-900', 'text-red-300', 'bg-gray-800', 'text-gray-400');
            diffIndicator.classList.add('bg-green-900', 'text-green-300');
            
            diffCard.style.borderColor = 'rgba(74, 222, 128, 0.3)';
        } else if (diffPercent < 0) {
            diffValue.textContent = '-' + formattedDiff;
            diffValue.classList.remove('text-green-400', 'text-white');
            diffValue.classList.add('text-red-400');
            
            diffIndicator.textContent = 'Loss';
            diffIndicator.classList.remove('bg-green-900', 'text-green-300', 'bg-gray-800', 'text-gray-400');
            diffIndicator.classList.add('bg-red-900', 'text-red-300');
            
            diffCard.style.borderColor = 'rgba(248, 113, 113, 0.3)';
        } else {
            diffValue.textContent = formattedDiff;
            diffValue.classList.remove('text-green-400', 'text-red-400');
            diffValue.classList.add('text-white');
            
            diffIndicator.textContent = 'Neutral';
            diffIndicator.classList.remove('bg-green-900', 'text-green-300', 'bg-red-900', 'text-red-300');
            diffIndicator.classList.add('bg-gray-800', 'text-gray-400');
            
            diffCard.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    }

    function updateChart(initialUsd, currentUsdValue, startDateStr) {
        const ctx = document.getElementById('impactChart').getContext('2d');
        
        const today = new Date().toISOString().split('T')[0];
        
        // Destroy existing chart if it exists
        if (impactChart) {
            impactChart.destroy();
        }

        // Create gradient for the line chart
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(247, 147, 26, 0.5)'); // Bitcoin orange with opacity
        gradient.addColorStop(1, 'rgba(247, 147, 26, 0.0)');

        impactChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [startDateStr, today],
                datasets: [
                    {
                        label: 'USD Held',
                        data: [initialUsd, initialUsd],
                        borderColor: '#9CA3AF',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointBackgroundColor: '#9CA3AF',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'BTC Value (in USD)',
                        data: [initialUsd, currentUsdValue],
                        borderColor: '#F7931A',
                        backgroundColor: gradient,
                        borderWidth: 3,
                        pointBackgroundColor: '#F7931A',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#F7931A',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: false // We use our custom legend in HTML
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#D1D5DB',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9CA3AF'
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false,
                        },
                        ticks: {
                            color: '#9CA3AF',
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                }
            }
        });
    }
});
