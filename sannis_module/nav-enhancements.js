// Navigation Enhancements - Event Listeners

document.addEventListener('DOMContentLoaded', function () {
  // Search Modal
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearchModal);
  }

  // Balance Dropdown
  const balanceTrigger = document.getElementById('balance-trigger');
  const balanceDropdownBtn = document.getElementById('balance-dropdown-btn');
  if (balanceTrigger) {
    balanceTrigger.addEventListener('click', toggleBalanceDropdown);
  }
  if (balanceDropdownBtn) {
    balanceDropdownBtn.addEventListener('click', toggleBalanceDropdown);
  }

  // Chain Options
  const chainOptions = document.querySelectorAll('.chain-option');
  chainOptions.forEach(option => {
    option.addEventListener('click', function () {
      const chain = this.getAttribute('data-chain');
      switchChain(chain);
    });
  });

  // Notifications Button
  const notificationsBtn = document.getElementById('notifications-btn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', openNotificationsModal);
  }

  // Profile Button
  const profileBtn = document.getElementById('profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', toggleProfileDropdown);
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', function (e) {
    const balanceContainer = document.getElementById('balance-container');
    const balanceDropdown = document.getElementById('balance-dropdown');
    const profileBtn = document.getElementById('profile-btn');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (balanceContainer && !balanceContainer.contains(e.target)) {
      if (balanceDropdown && !balanceDropdown.classList.contains('hidden')) {
        balanceDropdown.classList.add('hidden');
      }
    }

    if (profileBtn && !profileBtn.contains(e.target)) {
      if (profileDropdown && !profileDropdown.classList.contains('hidden') && !profileDropdown.contains(e.target)) {
        profileDropdown.classList.add('hidden');
        const chevron = document.getElementById('profile-chevron');
        if (chevron) chevron.style.transform = '';
      }
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    // "/" key to open search
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
      const activeElement = document.activeElement;
      if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        openSearchModal();
      }
    }

    // ESC to close modals
    if (e.key === 'Escape') {
      closeSearchModal();
      closeNotificationsModal();
    }
  });
});

// Balance Dropdown Functions
function toggleBalanceDropdown() {
  const menu = document.getElementById('balance-dropdown');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

function switchChain(chain) {
  const chainIcon = document.getElementById('chain-icon');
  const balanceAmount = document.getElementById('balance-amount');

  const icons = {
    'SOL': 'https://cdn.trojan.com/coins/sol.svg',
    'ETH': 'https://cdn.trojan.com/coins/eth.svg',
    'BTC': 'https://cdn.trojan.com/coins/btc.svg'
  };

  if (chainIcon) {
    chainIcon.src = icons[chain];
    chainIcon.alt = chain;
  }

  if (balanceAmount) {
    balanceAmount.textContent = '0.00';
  }

  toggleBalanceDropdown();
  console.log('Switched to ' + chain);
}

// Search Modal Functions
function openSearchModal() {
  let modal = document.getElementById('search-modal');
  if (!modal) {
    modal = createSearchModal();
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');

  setTimeout(() => {
    const input = document.getElementById('search-modal-input');
    if (input) input.focus();
  }, 100);
}

function createSearchModal() {
  const modal = document.createElement('div');
  modal.id = 'search-modal';
  modal.className = 'fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black bg-opacity-60';

  modal.innerHTML = `
    <div class="bg-bg-surface1 rounded-12 border border-stroke-subtle w-full max-w-2xl mx-4 overflow-hidden shadow-2xl">
      <div class="p-4 border-b border-stroke-subtle">
        <div class="flex items-center gap-3">
          <svg width="20" height="20" class="text-icon-tertiary">
            <use href="#icon-search-outline"></use>
          </svg>
          <input 
            id="search-modal-input" 
            type="text" 
            placeholder="Search tokens, wallets, transactions..." 
            class="flex-1 bg-transparent outline-none text-text-primary label-base"
          />
          <button id="close-search" class="text-icon-tertiary hover:text-icon-secondary">
            <svg width="20" height="20">
              <use href="#icon-close"></use>
            </svg>
          </button>
        </div>
      </div>
      <div id="search-results" class="p-4 max-h-96 overflow-y-auto">
        <div class="text-text-disabled label-sm text-center py-8">Start typing to search...</div>
      </div>
    </div>
  `;

  // Add event listeners
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeSearchModal();
  });

  const closeBtn = modal.querySelector('#close-search');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearchModal);
  }

  const searchInput = modal.querySelector('#search-modal-input');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      handleSearchInput(e.target.value);
    });
  }

  return modal;
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) modal.classList.add('hidden');
}

function handleSearchInput(query) {
  const resultsContainer = document.getElementById('search-results');
  if (!resultsContainer) return;

  if (!query || query.length < 2) {
    resultsContainer.innerHTML = '<div class="text-text-disabled label-sm text-center py-8">Start typing to search...</div>';
    return;
  }

  // Placeholder search results
  resultsContainer.innerHTML = `
    <div class="space-y-2">
      <div class="label-2xs text-text-tertiary px-2 py-1">Tokens</div>
      <div class="hover:bg-bg-surface2 rounded-8 p-3 cursor-pointer transition-colors">
        <div class="flex items-center gap-2">
          <img src="https://cdn.trojan.com/coins/sol.svg" class="w-8 h-8 rounded-full" />
          <div>
            <div class="label-sm text-text-primary">Solana</div>
            <div class="label-2xs text-text-tertiary">SOL</div>
          </div>
        </div>
      </div>
      <div class="label-2xs text-text-tertiary px-2 py-1 mt-4">No other results found</div>
    </div>
  `;
}

// Notifications Modal Functions
function openNotificationsModal() {
  let modal = document.getElementById('notifications-modal');
  if (!modal) {
    modal = createNotificationsModal();
    document.body.appendChild(modal);
  }
  modal.classList.remove('hidden');

  const badge = document.getElementById('notification-badge');
  if (badge) badge.classList.add('hidden');
}

function createNotificationsModal() {
  const modal = document.createElement('div');
  modal.id = 'notifications-modal';
  modal.className = 'fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4';

  modal.innerHTML = `
    <div class="bg-bg-surface1 rounded-12 border border-stroke-subtle w-full max-w-md overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
      <div class="p-4 border-b border-stroke-subtle flex items-center justify-between">
        <h3 class="label-base text-text-primary font-semibold">Notifications</h3>
        <button id="close-notifications" class="text-icon-tertiary hover:text-icon-secondary">
          <svg width="20" height="20">
            <use href="#icon-close"></use>
          </svg>
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div class="p-4 hover:bg-bg-surface2 transition-colors cursor-pointer border-b border-stroke-subtle">
          <div class="flex gap-3">
            <div class="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div class="flex-1">
              <div class="label-sm text-text-primary">Transaction Confirmed</div>
              <div class="label-2xs text-text-tertiary mt-1">Your swap of 0.5 SOL was successful</div>
              <div class="label-2xs text-text-disabled mt-1">2 minutes ago</div>
            </div>
          </div>
        </div>
        <div class="p-4 hover:bg-bg-surface2 transition-colors cursor-pointer border-b border-stroke-subtle">
          <div class="flex gap-3">
            <div class="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
            <div class="flex-1">
              <div class="label-sm text-text-primary">Price Alert</div>
              <div class="label-2xs text-text-tertiary mt-1">SOL reached your target price of $150</div>
              <div class="label-2xs text-text-disabled mt-1">1 hour ago</div>
            </div>
          </div>
        </div>
        <div class="p-4 hover:bg-bg-surface2 transition-colors cursor-pointer">
          <div class="flex gap-3">
            <div class="w-2 h-2 rounded-full bg-purple-500 mt-2"></div>
            <div class="flex-1">
              <div class="label-sm text-text-primary">Welcome to Trojan!</div>
              <div class="label-2xs text-text-tertiary mt-1">Get started with your first trade</div>
              <div class="label-2xs text-text-disabled mt-1">3 hours ago</div>
            </div>
          </div>
        </div>
      </div>
      <div class="p-3 border-t border-stroke-subtle">
        <button class="w-full label-xs text-text-secondary hover:text-text-primary transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
  `;

  // Add event listeners
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeNotificationsModal();
  });

  const closeBtn = modal.querySelector('#close-notifications');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeNotificationsModal);
  }

  return modal;
}

function closeNotificationsModal() {
  const modal = document.getElementById('notifications-modal');
  if (modal) modal.classList.add('hidden');
}

// Profile Dropdown Functions
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profile-dropdown');
  const chevron = document.getElementById('profile-chevron');

  if (dropdown) {
    dropdown.classList.toggle('hidden');

    // Rotate chevron
    if (chevron) {
      if (dropdown.classList.contains('hidden')) {
        chevron.style.transform = '';
      } else {
        chevron.style.transform = 'rotate(180deg)';
      }
    }
  }
}
