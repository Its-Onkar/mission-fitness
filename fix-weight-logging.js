// Quick fix for weight logging - improved frontend function
const improvedWeightLogging = `
async function logWeightToBackend(weight, notes = '') {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
        showToast('Authentication Error', 'error', 'Please log in again');
        window.location.href = '/login';
        return;
    }
    
    if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
        showToast('Invalid Weight', 'error', 'Please enter a weight between 20-300 kg');
        return;
    }
    
    try {
        console.log('🔄 Logging weight:', { weight, notes });
        
        const response = await fetch('/api/weight/log', {
            method: 'POST',
            headers: {
                'Authorization': \`Bearer \${token}\`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                weight: parseFloat(weight), 
                notes: notes || '' 
            })
        });

        console.log('📡 Response status:', response.status);
        
        const result = await response.json();
        console.log('📊 Response data:', result);

        if (response.ok && result.success) {
            const diff = result.progress?.difference || 0;
            const trend = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
            const trendColor = diff > 0 ? 'orange' : diff < 0 ? 'green' : 'blue';
            
            showToast('Weight Logged Successfully!', 'success', 
                \`\${weight} kg \${trend} \${Math.abs(diff).toFixed(1)} kg from last entry\`);
            
            // Update UI immediately
            document.getElementById('currentWeight').textContent = \`\${weight} kg\`;
            
            if (result.progress) {
                const prevWeight = result.progress.previous || weight;
                document.getElementById('prevWeight').textContent = \`Previous: \${prevWeight} kg\`;
                
                const weightDiffEl = document.getElementById('weightDiff');
                if (weightDiffEl) {
                    weightDiffEl.innerHTML = \`<span class="text-\${trendColor}-500">\${diff >= 0 ? '+' : ''}\${diff.toFixed(1)} kg</span>\`;
                }
                
                const totalProgressEl = document.getElementById('totalProgress');
                if (totalProgressEl && result.progress.totalProgress) {
                    totalProgressEl.textContent = \`\${result.progress.totalProgress.toFixed(1)} kg total\`;
                }
            }
            
            // Reload page after 2 seconds to refresh all data
            setTimeout(() => window.location.reload(), 2000);
            
        } else {
            throw new Error(result.message || 'Failed to log weight');
        }
        
    } catch (error) {
        console.error('❌ Weight logging error:', error);
        
        let errorMessage = 'Failed to log weight';
        let errorDetails = 'Please try again';
        
        if (error.message.includes('fetch')) {
            errorMessage = 'Network Error';
            errorDetails = 'Check your internet connection';
        } else if (error.message.includes('Authentication') || error.message.includes('401')) {
            errorMessage = 'Session Expired';
            errorDetails = 'Please log in again';
            setTimeout(() => window.location.href = '/login', 2000);
        } else if (error.message.includes('weight') || error.message.includes('400')) {
            errorMessage = 'Invalid Input';
            errorDetails = error.message;
        } else {
            errorDetails = error.message;
        }
        
        showToast(errorMessage, 'error', errorDetails);
    }
}

// Also improve the weight modal submission
async function submitWeight() {
    const weightInput = document.getElementById('weightInput');
    const notesInput = document.getElementById('notesInput');
    
    if (!weightInput || !notesInput) {
        showToast('Modal Error', 'error', 'Please try opening the modal again');
        return;
    }
    
    const weight = parseFloat(weightInput.value);
    const notes = notesInput.value.trim();
    
    if (!weight || isNaN(weight)) {
        showToast('Invalid Weight', 'error', 'Please enter a valid number');
        weightInput.focus();
        return;
    }
    
    if (weight < 20 || weight > 300) {
        showToast('Weight Out of Range', 'error', 'Please enter a weight between 20-300 kg');
        weightInput.focus();
        return;
    }
    
    // Disable submit button to prevent double submission
    const submitBtn = document.querySelector('button[onclick="submitWeight()"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';
    }
    
    try {
        await logWeightToBackend(weight, notes);
        closeWeightModal();
    } catch (error) {
        console.error('Submit weight error:', error);
    } finally {
        // Re-enable button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Weight';
        }
    }
}
`;

console.log('Weight logging fix ready. Copy the above functions to replace the existing ones in maindashboard.hbs');
console.log('Key improvements:');
console.log('1. Better error handling and user feedback');
console.log('2. Input validation before API call');
console.log('3. Detailed logging for debugging');
console.log('4. Proper authentication checks');
console.log('5. UI updates after successful logging');