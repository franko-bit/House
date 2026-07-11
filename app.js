const navbarTemplate = `
<header>
  <div class="container">
    <div class="navbar">
      <a href="index.html" class="logo">Estate<span>Hub</span></a>
      <button class="hamburger" id="hamburger" type="button" aria-label="Toggle navigation" aria-expanded="false">
        <i class="fas fa-bars"></i>
      </button>
      <nav class="nav-links" id="navLinks">
        <a href="index.html">Home</a>
        <a href="buy.html">Buy</a>
        <a href="rent.html">Rent</a>
        <a href="sell.html">Sell</a>
        <a href="property.html">Details</a>
        <a href="contact.html">Contact</a>
        <a href="create-post.html" data-auth="protected">Edit</a>
        <a href="login.html" data-auth="guest">Login</a>
        <a href="index.html" data-action="logout" data-auth="protected">Logout</a>
      </nav>
    </div>
  </div>
</header>`;

const AUTH_KEY = 'estateHubAuth';
const USER_KEY = 'estateHubUser';
const POSTS_KEY = 'estateHubPosts';
const PROTECTED_PAGES = new Set(['create-post.html']);
const ADMIN_CREDENTIALS = {
  email: 'admin@estatehub.com',
  password: 'admin123',
  name: 'Admin'
};

const DEMO_POSTS = [
  {
    id: 'demo-buy-1',
    title: 'Brand-New Duplex with Rebero Views — Gahanga',
    category: 'Buy',
    price: '390000000',
    bedrooms: '4',
    bathrooms: '3',
    location: 'Gahanga, Kigali',
    size: '320 m²',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?auto=format&fit=crop&w=900&q=80',
    description: 'Premium duplex with panoramic city views and a fully finished master suite.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-2',
    title: 'Sunny Garden Villa Near the Hillside',
    category: 'Buy',
    price: '720000000',
    bedrooms: '5',
    bathrooms: '4',
    location: 'Nyarutarama, Kigali',
    size: '420 m²',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=900&q=80',
    description: 'Peaceful villa surrounded by greenery with a generous lounge and landscaped garden.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-3',
    title: 'Modern Family House with Smart Living',
    category: 'Buy',
    price: '560000000',
    bedrooms: '4',
    bathrooms: '3',
    location: 'Mugina, Kigali',
    size: '340 m²',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    description: 'Bright family home with open-plan living, smart features, and a private outdoor area.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-4',
    title: 'Contemporary Townhouse with Family Lounge',
    category: 'Buy',
    price: '490000000',
    bedrooms: '3',
    bathrooms: '2',
    location: 'Nyabugogo, Kigali',
    size: '270 m²',
    type: 'Townhouse',
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80',
    description: 'Contemporary townhouse blending modern comfort, flexible family spaces, and a quiet street setting.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-5',
    title: 'Quiet Courtyard Residence with Garden',
    category: 'Buy',
    price: '410000000',
    bedrooms: '4',
    bathrooms: '3',
    location: 'Kicukiro, Kigali',
    size: '300 m²',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    description: 'A calm residence with a secure courtyard, garden amenity, and warm family-friendly layout.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-6',
    title: 'Luxury Apartment with Skyline Outlook',
    category: 'Buy',
    price: '610000000',
    bedrooms: '3',
    bathrooms: '2',
    location: 'Kigali Heights, Kigali',
    size: '220 m²',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=900&q=80',
    description: 'Elegant apartment with elevated views and a refined finish ideal for stylish urban living.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-7',
    title: 'High-End Bungalow with Open Living',
    category: 'Buy',
    price: '530000000',
    bedrooms: '4',
    bathrooms: '3',
    location: 'Masaka, Kigali',
    size: '310 m²',
    type: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=80',
    description: 'A modern bungalow built around airy interiors, seamless light, and relaxed family comfort.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-buy-8',
    title: 'Signature Residence with Premium Amenities',
    category: 'Buy',
    price: '680000000',
    bedrooms: '4',
    bathrooms: '3',
    location: 'Gacuriro, Kigali',
    size: '330 m²',
    type: 'Residence',
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
    description: 'A signature residence with standout finishes, generous rooms, and premium everyday convenience.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-rent-1',
    title: 'City Light Apartment with Rooftop Access',
    category: 'Rent',
    price: '1200000',
    bedrooms: '2',
    bathrooms: '2',
    location: 'Kacyiru, Kigali',
    size: '150 m²',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    description: 'Stylish apartment with rooftop access, modern finishes, and strong city convenience.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-rent-2',
    title: 'Skyline Loft with Premium Interiors',
    category: 'Rent',
    price: '1700000',
    bedrooms: '2',
    bathrooms: '2',
    location: 'Kimihurura, Kigali',
    size: '180 m²',
    type: 'Loft',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80',
    description: 'A loft-style living environment with elevated finishes and uninterrupted city views.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-rent-3',
    title: 'Urban House with Compact Garden',
    category: 'Rent',
    price: '1400000',
    bedrooms: '3',
    bathrooms: '2',
    location: 'Kimironko, Kigali',
    size: '210 m²',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80',
    description: 'A comfortable rental home with a quiet garden corner and practical family layout.',
    publishDate: '2026-07-11',
    status: 'Published'
  },
  {
    id: 'demo-rent-4',
    title: 'Executive Apartment with Workspace',
    category: 'Rent',
    price: '1900000',
    bedrooms: '3',
    bathrooms: '2',
    location: 'Remera, Kigali',
    size: '200 m²',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80',
    description: 'A polished rental option for professionals looking for flexible work-from-home comfort.',
    publishDate: '2026-07-11',
    status: 'Published'
  }
];

const getStoredPosts = () => {
  try {
    const posts = JSON.parse(localStorage.getItem(POSTS_KEY) || '[]');
    return Array.isArray(posts) ? posts : [];
  } catch {
    return [];
  }
};

const saveStoredPosts = (posts) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

const seedDemoPosts = () => {
  const existingPosts = getStoredPosts();
  const existingIds = new Set(existingPosts.map((post) => post.id));
  const missingPosts = DEMO_POSTS.filter((post) => !existingIds.has(post.id));

  if (!missingPosts.length) return;

  saveStoredPosts([...existingPosts, ...missingPosts]);
};

const getPublishedPosts = () => getStoredPosts().filter((post) => (post.status || 'Published').toLowerCase() !== 'draft');

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[char]));

const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return value;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(number);
};

const getCurrentPage = () => window.location.pathname.split('/').pop() || 'index.html';

const isLoggedIn = () => sessionStorage.getItem(AUTH_KEY) === 'true';

const setActiveLink = () => {
  const currentPage = getCurrentPage();

  document.querySelectorAll('.nav-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
};

const updateAuthUI = () => {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  const loggedIn = isLoggedIn();
  navLinks.querySelectorAll('[data-auth]').forEach((link) => {
    const authType = link.getAttribute('data-auth');
    const shouldShow = authType === 'protected'
      ? loggedIn
      : authType === 'guest'
        ? !loggedIn
        : true;

    link.style.display = shouldShow ? 'block' : 'none';
  });

  const logoutLink = navLinks.querySelector('[data-action="logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      sessionStorage.removeItem(AUTH_KEY);
      sessionStorage.removeItem(USER_KEY);
      window.location.href = 'index.html';
    });
  }
};

const guardProtectedPages = () => {
  const currentPage = getCurrentPage();

  if (currentPage === 'login.html' && isLoggedIn()) {
    window.location.replace('create-post.html');
    return;
  }

  if (PROTECTED_PAGES.has(currentPage) && !isLoggedIn()) {
    window.location.replace(`login.html?returnTo=${encodeURIComponent(currentPage)}`);
  }
};

const initNavbar = () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!hamburger || !navLinks) return;

  const updateMenu = (isOpen) => {
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    const icon = hamburger.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-times', isOpen);
    }

    if (window.innerWidth > 700) {
      navLinks.style.display = '';
    } else {
      navLinks.style.display = isOpen ? 'flex' : 'none';
    }
  };

  hamburger.addEventListener('click', () => {
    const isOpen = !navLinks.classList.contains('open');
    updateMenu(isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => updateMenu(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) {
      updateMenu(false);
    }
  });

  updateMenu(false);
};

const loadSharedNavbar = async () => {
  const navbarRoot = document.getElementById('navbar-root');
  if (!navbarRoot) return;

  try {
    if (window.location.protocol !== 'file:') {
      const response = await fetch('navbar.html');
      if (response.ok) {
        navbarRoot.innerHTML = await response.text();
      } else {
        navbarRoot.innerHTML = navbarTemplate;
      }
    } else {
      navbarRoot.innerHTML = navbarTemplate;
    }
  } catch (error) {
    navbarRoot.innerHTML = navbarTemplate;
  }

  setActiveLink();
  updateAuthUI();
  initNavbar();
  guardProtectedPages();
};

const initLoginForm = () => {
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  if (!loginForm || !loginError) return;

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(USER_KEY, ADMIN_CREDENTIALS.name);
      const urlParams = new URLSearchParams(window.location.search);
      const returnTo = urlParams.get('returnTo') || 'create-post.html';
      window.location.href = returnTo;
      return;
    }

    loginError.textContent = 'Invalid email or password. Use admin@estatehub.com / admin123.';
  });
};

const initCreatePostForm = () => {
  const form = document.getElementById('createPostForm');
  const message = document.getElementById('postMessage');
  const saveDraftBtn = document.getElementById('saveDraftBtn');

  if (!form || !message || !saveDraftBtn) return;

  const pageTitle = document.querySelector('.page-title');
  const pageSubtitle = document.querySelector('.page-subtitle');
  const submitButton = form.querySelector('button[type="submit"]');
  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get('editId');
  const existingPost = editId ? getStoredPosts().find((post) => post.id === editId) : null;
  const isEditMode = Boolean(existingPost);

  if (isEditMode) {
    pageTitle.textContent = 'Edit Post';
    pageSubtitle.textContent = 'Update the property listing and keep the card information current.';
    submitButton.textContent = 'Update Post';
    saveDraftBtn.textContent = 'Save as Draft';

    document.getElementById('postTitle').value = existingPost.title || '';
    document.getElementById('postCategory').value = existingPost.category || 'Buy';
    document.getElementById('postPrice').value = existingPost.price || '';
    document.getElementById('postBedrooms').value = existingPost.bedrooms || '';
    document.getElementById('postBathrooms').value = existingPost.bathrooms || '';
    document.getElementById('postLocation').value = existingPost.location || '';
    document.getElementById('postSize').value = existingPost.size || '';
    document.getElementById('postType').value = existingPost.type || '';
    document.getElementById('postImage').value = existingPost.image || '';
    document.getElementById('postDescription').value = existingPost.description || '';
    document.getElementById('postDate').value = existingPost.publishDate || '';
    document.getElementById('postStatus').value = existingPost.status || 'Published';
  }

  const setMessage = (text, isError = false) => {
    message.textContent = text;
    message.style.display = 'block';
    message.style.background = isError ? '#fff1f1' : '#f4f7f1';
    message.style.color = isError ? '#b42318' : '#1f4d1f';
  };

  const collectFormData = (forcedStatus = null) => {
    const selectedStatus = document.getElementById('postStatus')?.value || 'Published';
    const data = {
      id: isEditMode ? editId : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: document.getElementById('postTitle').value.trim(),
      category: document.getElementById('postCategory').value,
      price: document.getElementById('postPrice').value.trim(),
      bedrooms: document.getElementById('postBedrooms').value.trim(),
      bathrooms: document.getElementById('postBathrooms').value.trim(),
      location: document.getElementById('postLocation').value.trim(),
      size: document.getElementById('postSize').value.trim(),
      type: document.getElementById('postType').value.trim(),
      image: document.getElementById('postImage').value.trim(),
      description: document.getElementById('postDescription').value.trim(),
      publishDate: document.getElementById('postDate').value,
      status: forcedStatus || selectedStatus
    };

    const requiredFields = [data.title, data.price, data.bedrooms, data.bathrooms, data.location, data.size, data.type, data.image, data.description, data.publishDate];
    if (requiredFields.some((field) => !field)) {
      setMessage('Please complete every required field before publishing the listing.', true);
      return null;
    }

    return data;
  };

  const savePost = (forcedStatus, event) => {
    event.preventDefault();
    const data = collectFormData(forcedStatus);
    if (!data) return;

    const posts = getStoredPosts();

    if (isEditMode) {
      const existingIndex = posts.findIndex((post) => post.id === editId);
      if (existingIndex >= 0) {
        posts[existingIndex] = data;
      }
      saveStoredPosts(posts);
      setMessage(`Listing updated successfully as ${data.status.toLowerCase()}.`);
      return;
    }

    posts.unshift(data);
    saveStoredPosts(posts);
    form.reset();
    setMessage(`Listing saved successfully as ${data.status.toLowerCase()}. It will appear in the ${data.category} property cards.`);
  };

  form.addEventListener('submit', (event) => savePost(null, event));
  saveDraftBtn.addEventListener('click', (event) => savePost('Draft', event));
};

const renderPropertyDetails = () => {
  if (getCurrentPage() !== 'property.html') return;

  const urlParams = new URLSearchParams(window.location.search);
  const selectedPostId = urlParams.get('id');
  const post = getStoredPosts().find((entry) => entry.id === selectedPostId) || getStoredPosts()[0];

  if (!post) return;

  const hero = document.querySelector('.hero-property');
  const titleNode = document.querySelector('.hero-property .title-group h1');
  const priceNode = document.querySelector('.hero-property .price-tag');
  const badgeGroup = document.querySelector('.hero-property .badge-group');
  const metaGrid = document.querySelector('.details-main .meta-grid');
  const descriptionNodes = document.querySelectorAll('.details-main p');
  const mapLabel = document.querySelector('.map-card .map-overlay span');
  const agentNameNode = document.querySelector('.agent-info strong');
  const agentTitleNode = document.querySelector('.agent-info span');

  if (hero) {
    hero.style.backgroundImage = `url('${escapeHtml(post.image)}')`;
  }

  if (titleNode) {
    titleNode.textContent = post.title || 'Property details';
  }

  if (priceNode) {
    priceNode.textContent = formatPrice(post.price);
  }

  if (badgeGroup) {
    badgeGroup.innerHTML = `
      <span><i class="fas fa-bed"></i> ${escapeHtml(post.bedrooms)} beds</span>
      <span><i class="fas fa-bath"></i> ${escapeHtml(post.bathrooms)} baths</span>
      <span><i class="fas fa-expand"></i> ${escapeHtml(post.size)}</span>
    `;
  }

  if (metaGrid) {
    metaGrid.innerHTML = `
      <span><strong>Price</strong> ${escapeHtml(formatPrice(post.price))}</span>
      <span><strong>Bedrooms</strong> ${escapeHtml(post.bedrooms)}</span>
      <span><strong>Bathrooms</strong> ${escapeHtml(post.bathrooms)}</span>
      <span><strong>Location</strong> ${escapeHtml(post.location)}</span>
      <span><strong>Category</strong> ${escapeHtml(post.category)}</span>
      <span><strong>Type</strong> ${escapeHtml(post.type)}</span>
    `;
  }

  if (descriptionNodes.length > 0) {
    descriptionNodes[0].textContent = post.description || 'A refined property listing featured on our directory.';
  }

  if (descriptionNodes.length > 1) {
    descriptionNodes[1].textContent = `${escapeHtml(post.type)} in ${escapeHtml(post.location)} with ${escapeHtml(post.bedrooms)} bedrooms and ${escapeHtml(post.bathrooms)} bathrooms.`;
  }

  if (mapLabel) {
    mapLabel.textContent = post.location;
  }

  if (agentNameNode) {
    agentNameNode.textContent = 'EstateHub Team';
  }

  if (agentTitleNode) {
    agentTitleNode.textContent = 'Property Concierge';
  }
};

const renderDashboardMetrics = () => {
  if (getCurrentPage() !== 'dashboard.html') return;

  const posts = getPublishedPosts();
  const activeListings = posts.filter((post) => post.status !== 'Sold');
  const buyListings = activeListings.filter((post) => post.category === 'Buy');
  const rentListings = activeListings.filter((post) => post.category === 'Rent');
  const soldListings = posts.filter((post) => post.status === 'Sold');

  const statMap = {
    totalProperties: posts.length,
    forSale: buyListings.length,
    forRent: rentListings.length,
    soldProperties: soldListings.length
  };

  Object.entries(statMap).forEach(([key, value]) => {
    const statNode = document.querySelector(`[data-stat="${key}"]`);
    if (statNode) {
      statNode.textContent = value;
    }
  });
};

const renderDashboardProperties = () => {
  if (getCurrentPage() !== 'dashboard.html') return;

  const list = document.getElementById('dashboardPropertyList');
  if (!list) return;

  const posts = getPublishedPosts().slice(0, 3);

  if (!posts.length) {
    list.innerHTML = `
      <div class="property-mini">
        <div class="info">
          <h4>No properties yet</h4>
          <p>Create your first listing to populate the dashboard.</p>
        </div>
      </div>
    `;
    return;
  }

  list.innerHTML = posts.map((post) => {
    const statusClass = post.status === 'Sold' ? 'badge badge-primary' : 'badge';
    return `
      <div class="property-mini">
        <div class="info">
          <h4>${escapeHtml(post.title)}</h4>
          <p>${escapeHtml(post.category)} · ${escapeHtml(post.status || 'Published')}</p>
        </div>
        <div><span class="${statusClass}">${escapeHtml(post.status || 'Published')}</span></div>
      </div>
    `;
  }).join('');
};

const deletePostById = (postId) => {
  const posts = getStoredPosts().filter((post) => post.id !== postId);
  saveStoredPosts(posts);
  renderListingCards();
  renderDashboardMetrics();
  renderDashboardProperties();
};

const renderListingCards = () => {
  const currentPage = getCurrentPage();
  const grid = document.querySelector('.grid-4');

  if (!grid || !['buy.html', 'rent.html'].includes(currentPage)) return;

  const category = currentPage === 'rent.html' ? 'Rent' : 'Buy';
  const posts = getStoredPosts().filter((post) => post.category === category && (post.status || 'Published') !== 'Sold');

  grid.innerHTML = '';

  if (!posts.length) {
    grid.innerHTML = `
      <div class="card dynamic-card" style="grid-column: 1 / -1; padding: 28px;">
        <h3>No ${escapeHtml(category.toLowerCase())} listings yet</h3>
        <p style="color:#5a5a5a; margin-top: 8px;">Create a post from the admin page to publish a new property card.</p>
      </div>
    `;
    return;
  }

  const loggedIn = isLoggedIn();
  const cards = posts.map((post) => `
    <article class="card dynamic-card" data-post-id="${escapeHtml(post.id)}">
      <a href="property.html?id=${encodeURIComponent(post.id)}" data-post-id="${escapeHtml(post.id)}" style="display:block; color:inherit; text-decoration:none;">
        <div class="card-img" style="background-image: url('${escapeHtml(post.image)}');"></div>
        <div class="card-body">
          <h3>${escapeHtml(post.title)}</h3>
          <div class="price">${formatPrice(post.price)}</div>
          <div class="meta">
            <span><i class="fas fa-bed"></i> ${escapeHtml(post.bedrooms)} beds</span>
            <span><i class="fas fa-bath"></i> ${escapeHtml(post.bathrooms)} baths</span>
          </div>
          <div style="font-size: 13px; color: #5a5a5a; margin-bottom: 10px; line-height: 1.5;">
            <div><strong>Location:</strong> ${escapeHtml(post.location)}</div>
            <div><strong>Type:</strong> ${escapeHtml(post.type)}</div>
            <div><strong>Size:</strong> ${escapeHtml(post.size)}</div>
          </div>
          <div style="font-size: 13px; color: #5a5a5a; margin-bottom: 14px; line-height: 1.5;">${escapeHtml(post.description)}</div>
        </div>
      </a>
      ${loggedIn ? `
        <div style="display:flex; gap:8px; padding: 0 20px 20px;">
          <button type="button" data-action="edit-post" data-post-id="${escapeHtml(post.id)}" style="flex:1; border:1px solid #111; background:#fff; color:#111; border-radius:999px; padding:9px 14px; font-weight:700; cursor:pointer;">Edit</button>
          <button type="button" data-action="delete-post" data-post-id="${escapeHtml(post.id)}" style="flex:1; border:1px solid #111; background:#111; color:#fff; border-radius:999px; padding:9px 14px; font-weight:700; cursor:pointer;">Delete</button>
        </div>
      ` : ''}
    </article>
  `).join('');

  grid.insertAdjacentHTML('beforeend', cards);
};

const attachListingActions = () => {
  document.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-action="edit-post"]');
    if (editButton) {
      const postId = editButton.getAttribute('data-post-id');
      if (postId) {
        window.location.href = `create-post.html?editId=${encodeURIComponent(postId)}`;
      }
      return;
    }

    const deleteButton = event.target.closest('[data-action="delete-post"]');
    if (deleteButton) {
      const postId = deleteButton.getAttribute('data-post-id');
      if (postId && window.confirm('Delete this listing?')) {
        deletePostById(postId);
      }
    }
  });
};

document.addEventListener('DOMContentLoaded', () => {
  seedDemoPosts();
  loadSharedNavbar();
  initLoginForm();
  initCreatePostForm();
  renderPropertyDetails();
  renderDashboardMetrics();
  renderDashboardProperties();
  renderListingCards();
  attachListingActions();
});
