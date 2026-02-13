// Signup Form Logic for Le Centre Franco Tournaments
// Handles Roblox username validation and registration

(function() {
  'use strict';

  // Wait for DOM to be ready
  document.addEventListener('DOMContentLoaded', initSignupForm);

  function initSignupForm() {
    const form = document.getElementById('signupForm');
    const usernameInput = document.getElementById('robloxUsername');
    
    // Real-time username validation (debounced)
    let validationTimeout;
    usernameInput.addEventListener('input', function() {
      clearTimeout(validationTimeout);
      validationTimeout = setTimeout(() => validateUsername(), 800);
    });
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
  }

  // ============================================
  // ROBLOX USERNAME VALIDATION
  // ============================================
  
  async function validateUsername() {
    const usernameInput = document.getElementById('robloxUsername');
    const username = usernameInput.value.trim();
    const errorDiv = document.getElementById('usernameError');
    const successDiv = document.getElementById('usernameSuccess');
    
    // Clear previous messages
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
    
    // Check if empty
    if (!username) {
      return;
    }
    
    // Check format (3-20 chars, alphanumeric + underscore)
    const validFormat = /^[A-Za-z0-9_]{3,20}$/.test(username);
    if (!validFormat) {
      showError(errorDiv, window.i18n.t('signup.errorInvalidUsername'));
      return false;
    }
    
  // Check if user exists on Roblox
  try {
    const exists = await checkRobloxUser(username);
    
    if (exists) {
      showSuccess(successDiv, `✓ ${username} - ${window.i18n.t('common.success')}`);
      return true;
    } else {
      showError(errorDiv, window.i18n.t('signup.errorUserNotFound'));
      return false;
    }
  } catch (error) {
    // CORS error or network issue - allow fallback for localhost testing
    console.warn('Roblox API validation failed (CORS/network):', error);
    
    // Show warning but allow form submission
    if (errorDiv) {
      errorDiv.innerHTML = `⚠️ ${window.i18n.t('signup.validationWarning') || 'Cannot verify username (will work once deployed). Proceeding...'}`;
      errorDiv.classList.remove('hidden');
      errorDiv.style.background = '#FFF3CD';
      errorDiv.style.color = '#856404';
    }
    
    return true; // Allow submission anyway for localhost testing
  }
  }
  
  // Check if Roblox user exists via API
  async function checkRobloxUser(username) {
    try {
      const response = await fetch(
        `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`
      );
      
      if (!response.ok) {
        throw new Error('Roblox API error');
      }
      
      const data = await response.json();
      
      // Check for exact match (case-insensitive)
      const user = data.data.find(u => 
        u.name.toLowerCase() === username.toLowerCase()
      );
      
      return !!user;
    } catch (error) {
      console.error('Error checking Roblox user:', error);
      throw error;
    }
  }

  // ============================================
  // FORM SUBMISSION
  // ============================================
  
  async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const loadingState = document.getElementById('loadingState');
    
    // Get form data
    const formData = {
      robloxUsername: document.getElementById('robloxUsername').value.trim(),
      tournament: document.querySelector('input[name="tournament"]:checked')?.value,
      ageConfirm: document.getElementById('ageConfirm').checked,
      rulesAccept: document.getElementById('rulesAccept').checked
    };
    
    // Validate all fields
    const isValid = await validateForm(formData);
    if (!isValid) {
      return;
    }
    
    // Disable submit button and show loading
    submitBtn.disabled = true;
    loadingState.classList.remove('hidden');
    
    try {
      // Check if Supabase is configured
      if (!window.supabaseConfig || !window.supabaseConfig.isSupabaseConfigured()) {
        // Fallback: Show success without saving to database
        console.warn('Supabase not configured. Registration not saved to database.');
        showSuccessPage({
          id: 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          username: formData.robloxUsername,
          tournament: formData.tournament
        });
        return;
      }
      
      // Save to Supabase
      const result = await saveToDatabase(formData);
      
      // Show success page
      showSuccessPage(result);
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Show error message
      if (error.message.includes('already registered')) {
        alert(window.i18n.t('signup.errorAlreadyRegistered'));
      } else {
        alert(window.i18n.t('signup.errorServerError'));
      }
      
      // Re-enable submit button
      submitBtn.disabled = false;
      loadingState.classList.add('hidden');
    }
  }
  
  // Validate entire form
  async function validateForm(formData) {
    let isValid = true;
    
    // Validate username
    const usernameValid = await validateUsername();
    if (!usernameValid) {
      isValid = false;
    }
    
    // Validate tournament selection
    if (!formData.tournament) {
      const errorDiv = document.getElementById('tournamentError');
      showError(errorDiv, window.i18n.t('signup.errorSelectTournament'));
      isValid = false;
    }
    
    // Validate age confirmation
    if (!formData.ageConfirm) {
      const errorDiv = document.getElementById('ageError');
      showError(errorDiv, window.i18n.t('signup.errorAgeConfirm'));
      isValid = false;
    }
    
    // Validate rules acceptance
    if (!formData.rulesAccept) {
      const errorDiv = document.getElementById('rulesError');
      showError(errorDiv, window.i18n.t('signup.errorRulesConfirm'));
      isValid = false;
    }
    
    return isValid;
  }

  // ============================================
  // DATABASE OPERATIONS
  // ============================================
  
  async function saveToDatabase(formData) {
    const supabase = window.supabaseConfig.supabase;
    const TABLES = window.supabaseConfig.TABLES;
    
    // Check for duplicate registration
    const { data: existing, error: checkError } = await supabase
      .from(TABLES.PARTICIPANTS)
      .select('*')
      .eq('roblox_username', formData.robloxUsername)
      .eq('tournament_type', formData.tournament);
    
    if (checkError) {
      throw new Error('Database check error: ' + checkError.message);
    }
    
    if (existing && existing.length > 0) {
      throw new Error('User already registered for this tournament');
    }
    
    // Insert new participant
    const { data, error } = await supabase
      .from(TABLES.PARTICIPANTS)
      .insert({
        roblox_username: formData.robloxUsername,
        tournament_type: formData.tournament,
        verified: false
      })
      .select()
      .single();
    
    if (error) {
      throw new Error('Registration error: ' + error.message);
    }
    
    return {
      id: data.id.substring(0, 8).toUpperCase(),
      username: formData.robloxUsername,
      tournament: formData.tournament
    };
  }

  // ============================================
  // UI HELPERS
  // ============================================
  
  function showError(element, message) {
    element.textContent = '⚠️ ' + message;
    element.classList.remove('hidden');
  }
  
  function showSuccess(element, message) {
    element.textContent = message;
    element.classList.remove('hidden');
  }
  
  function showSuccessPage(data) {
    // Hide form, show success message
    document.getElementById('signupFormContainer').classList.add('hidden');
    document.getElementById('successContainer').classList.remove('hidden');
    
    // Populate success message data
    document.getElementById('registrationId').textContent = '#' + data.id;
    document.getElementById('confirmedUsername').textContent = data.username;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

})();
