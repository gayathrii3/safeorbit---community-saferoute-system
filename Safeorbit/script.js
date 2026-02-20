// Global state
let currentSection = "map";
let selectedRoute = "safest";

// Navigation functions
function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".section-content").forEach((el) => {
    el.classList.add("hidden");
  });

  // Show selected section
  document.getElementById(section + "-section").classList.remove("hidden");
  document.getElementById(section + "-section").classList.add("fade-in");

  // Update navigation
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("text-blue-200");
  });
  event.target.classList.add("text-blue-200");

  currentSection = section;
}

// Route selection
function selectRoute(routeType) {
  // Remove previous selection
  document.querySelectorAll(".route-option").forEach((btn) => {
    btn.classList.remove("bg-blue-100", "border-blue-400");
  });

  // Add selection to clicked route
  event.target.classList.add("bg-blue-100", "border-blue-400");
  selectedRoute = routeType;

  // Update route visualization
  updateRouteVisualization(routeType);
}

function updateRouteVisualization(routeType) {
  const routeLines = document.querySelectorAll(".route-line");
  routeLines.forEach((line) => {
    switch (routeType) {
      case "safest":
        line.style.background = "linear-gradient(90deg, #10b981, #059669)";
        break;
      case "balanced":
        line.style.background = "linear-gradient(90deg, #3b82f6, #1d4ed8)";
        break;
      case "fastest":
        line.style.background = "linear-gradient(90deg, #f59e0b, #d97706)";
        break;
    }
  });
}

// Tile information modal
function showTileInfo(area, safetyLevel) {
  const modal = document.getElementById("tile-modal");
  const title = document.getElementById("modal-title");
  const content = document.getElementById("modal-content");

  title.textContent = area;

  const safetyData = {
    high: {
      score: "8.5/10",
      color: "text-green-600",
      details:
        "Well-lit area with high foot traffic and regular police patrols. Multiple CCTV cameras and good public transport access.",
    },
    medium: {
      score: "6.2/10",
      color: "text-yellow-600",
      details:
        "Moderate safety with some concerns. Limited lighting in certain areas. Recommended to travel in groups during evening hours.",
    },
    low: {
      score: "3.8/10",
      color: "text-red-600",
      details:
        "High-risk area with recent incident reports. Poor lighting and limited surveillance. Avoid during late hours and consider alternative routes.",
    },
  };

  const data = safetyData[safetyLevel];
  content.innerHTML = `
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">Safety Score</p>
                    <p class="text-2xl font-bold ${data.color}">${
    data.score
  }</p>
                </div>
                <div class="mb-4">
                    <p class="text-sm text-gray-600 mb-2">Details</p>
                    <p class="text-sm text-gray-800">${data.details}</p>
                </div>
                <div class="text-xs text-gray-500">
                    Last updated: ${new Date().toLocaleTimeString()}
                </div>
            `;

  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeTileModal() {
  document.getElementById("tile-modal").classList.add("hidden");
  document.getElementById("tile-modal").classList.remove("flex");
}

// Emergency alert
function emergencyAlert() {
  alert(
    "🚨 Emergency services have been notified of your location. Help is on the way.\n\nStay calm and move to a safe location if possible."
  );
}

// Report functions
function submitReport(event) {
  event.preventDefault();

  // Simulate form submission
  const formData = new FormData(event.target);

  // Show success message
  alert(
    "✅ Report submitted successfully! Thank you for helping keep our community safe.\n\nYour report will be verified and added to the safety database within 5 minutes."
  );

  // Clear form
  event.target.reset();
}

function clearForm() {
  document.querySelector("#report-section form").reset();
}

function useCurrentLocation() {
  // Simulate getting current location
  const locationInput = document.querySelector(
    '#report-section input[type="text"]'
  );
  locationInput.value = "123 Main Street, Downtown District";
}

// Alert functions
function dismissAlert(button) {
  const alert = button.closest(".border-l-4");
  alert.style.animation = "fadeOut 0.3s ease-out";
  setTimeout(() => {
    alert.remove();
  }, 300);
}

// Analytics functions
function exportData() {
  alert(
    "📊 Safety data export initiated. You will receive a download link via email within 10 minutes."
  );
}

function schedulePatrol() {
  alert(
    "👮 Patrol scheduling request sent to local authorities. They will review high-risk areas and adjust patrol routes accordingly."
  );
}

function generateReport() {
  alert(
    "📋 Comprehensive safety report is being generated. This includes incident trends, safety scores, and recommendations for improvement."
  );
}

// Map functions
let currentZoom = 1;
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let mapTransform = { x: 0, y: 0, scale: 1 };

function initializeMap() {
  const mapSvg = document.getElementById("map-svg");
  const indiaMap = document.getElementById("india-map");
  const zoomInBtn = document.getElementById("zoom-in");
  const zoomOutBtn = document.getElementById("zoom-out");
  const resetZoomBtn = document.getElementById("reset-zoom");
  const showLocationBtn = document.getElementById("show-location");

  // Zoom controls
  zoomInBtn.addEventListener("click", () => zoomMap(1.5));
  zoomOutBtn.addEventListener("click", () => zoomMap(0.67));
  resetZoomBtn.addEventListener("click", resetMapView);
  showLocationBtn.addEventListener("click", showCurrentLocation);

  // City click handlers
  document.querySelectorAll(".city-group").forEach((cityGroup) => {
    cityGroup.addEventListener("click", (e) => {
      e.stopPropagation();
      const cityName = cityGroup.dataset.city;
      zoomToCity(cityName, cityGroup);
      showCityInfo(cityName);
    });

    cityGroup.addEventListener("mouseenter", () => {
      cityGroup.style.cursor = "pointer";
      cityGroup.style.filter = "brightness(1.1)";
    });

    cityGroup.addEventListener("mouseleave", () => {
      cityGroup.style.filter = "brightness(1)";
    });
  });

  // Safety zone hover effects
  document.querySelectorAll(".safety-zone").forEach((zone) => {
    zone.addEventListener("mouseenter", (e) => {
      const rect = zone.getBoundingClientRect();
      showSafetyTooltip(e, zone);
    });

    zone.addEventListener("mouseleave", hideSafetyTooltip);
  });

  // Pan functionality
  indiaMap.addEventListener("mousedown", startDrag);
  indiaMap.addEventListener("mousemove", drag);
  indiaMap.addEventListener("mouseup", endDrag);
  indiaMap.addEventListener("mouseleave", endDrag);

  // Touch support for mobile
  indiaMap.addEventListener("touchstart", handleTouchStart);
  indiaMap.addEventListener("touchmove", handleTouchMove);
  indiaMap.addEventListener("touchend", endDrag);
}

function zoomMap(factor) {
  currentZoom *= factor;
  currentZoom = Math.max(0.5, Math.min(currentZoom, 5));

  mapTransform.scale = currentZoom;
  updateMapTransform();
  updateZoomLevel();
}

function zoomToCity(cityName, cityElement) {
  const cityRect = cityElement.getBBox();
  const mapSvg = document.getElementById("map-svg");
  const svgRect = mapSvg.getBoundingClientRect();

  // Calculate zoom to fit city
  const targetZoom = 3;
  const centerX = cityRect.x + cityRect.width / 2;
  const centerY = cityRect.y + cityRect.height / 2;

  // Calculate translation to center the city
  mapTransform.scale = targetZoom;
  mapTransform.x = svgRect.width / 2 - centerX * targetZoom;
  mapTransform.y = svgRect.height / 2 - centerY * targetZoom;

  currentZoom = targetZoom;
  updateMapTransform();
  updateZoomLevel();
}

function resetMapView() {
  currentZoom = 1;
  mapTransform = { x: 0, y: 0, scale: 1 };
  updateMapTransform();
  updateZoomLevel();
  closeCityInfo();
}

function updateMapTransform() {
  const mapSvg = document.getElementById("map-svg");
  mapSvg.style.transform = `translate(${mapTransform.x}px, ${mapTransform.y}px) scale(${mapTransform.scale})`;
}

function updateZoomLevel() {
  document.getElementById("zoom-level").textContent = `${currentZoom.toFixed(
    1
  )}x`;
}

function startDrag(e) {
  isDragging = true;
  dragStart.x = e.clientX - mapTransform.x;
  dragStart.y = e.clientY - mapTransform.y;
  document.getElementById("india-map").style.cursor = "grabbing";
}

function drag(e) {
  if (!isDragging) return;

  mapTransform.x = e.clientX - dragStart.x;
  mapTransform.y = e.clientY - dragStart.y;
  updateMapTransform();
}

function endDrag() {
  isDragging = false;
  document.getElementById("india-map").style.cursor = "move";
}

function handleTouchStart(e) {
  const touch = e.touches[0];
  startDrag({ clientX: touch.clientX, clientY: touch.clientY });
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  drag({ clientX: touch.clientX, clientY: touch.clientY });
}

function showCurrentLocation() {
  const locationIndicator = document.getElementById("current-location");
  locationIndicator.style.display = "block";

  // Simulate location detection
  setTimeout(() => {
    // Position over Delhi (example)
    locationIndicator.style.left = "30%";
    locationIndicator.style.top = "31%";

    // Zoom to current location
    zoomToCity("Delhi", document.querySelector('[data-city="Delhi"]'));

    alert("📍 Current location detected: New Delhi\nSafety Score: 7.8/10");
  }, 1000);
}

function showCityInfo(cityName) {
  const cityInfo = document.getElementById("city-info");
  const cityNameEl = document.getElementById("city-name");
  const cityStats = document.getElementById("city-stats");

  const cityData = {
    Delhi: {
      safety: "7.8/10",
      population: "32.9M",
      alerts: "12 active",
      trend: "↗️ Improving",
      lastUpdate: "2 min ago",
    },
    Mumbai: {
      safety: "8.2/10",
      population: "20.4M",
      alerts: "8 active",
      trend: "↗️ Improving",
      lastUpdate: "1 min ago",
    },
    Bangalore: {
      safety: "8.5/10",
      population: "12.3M",
      alerts: "5 active",
      trend: "→ Stable",
      lastUpdate: "3 min ago",
    },
    Chennai: {
      safety: "7.9/10",
      population: "10.9M",
      alerts: "7 active",
      trend: "↗️ Improving",
      lastUpdate: "1 min ago",
    },
    Kolkata: {
      safety: "6.8/10",
      population: "14.8M",
      alerts: "15 active",
      trend: "↘️ Declining",
      lastUpdate: "4 min ago",
    },
    Hyderabad: {
      safety: "8.1/10",
      population: "10.0M",
      alerts: "6 active",
      trend: "→ Stable",
      lastUpdate: "2 min ago",
    },
    Pune: {
      safety: "8.3/10",
      population: "7.4M",
      alerts: "4 active",
      trend: "↗️ Improving",
      lastUpdate: "1 min ago",
    },
    Ahmedabad: {
      safety: "7.2/10",
      population: "8.4M",
      alerts: "9 active",
      trend: "→ Stable",
      lastUpdate: "3 min ago",
    },
  };

  const data = cityData[cityName] || cityData["Delhi"];

  cityNameEl.textContent = cityName;
  cityStats.innerHTML = `
                <div class="flex justify-between">
                    <span class="text-gray-600">Safety Score:</span>
                    <span class="font-medium text-green-600">${data.safety}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Population:</span>
                    <span class="font-medium">${data.population}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Active Alerts:</span>
                    <span class="font-medium text-orange-600">${data.alerts}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Trend:</span>
                    <span class="font-medium">${data.trend}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-600">Updated:</span>
                    <span class="font-medium text-blue-600">${data.lastUpdate}</span>
                </div>
            `;

  cityInfo.classList.remove("hidden");
}

function closeCityInfo() {
  document.getElementById("city-info").classList.add("hidden");
}

function showSafetyTooltip(e, zone) {
  // Create tooltip if it doesn't exist
  let tooltip = document.getElementById("safety-tooltip");
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "safety-tooltip";
    tooltip.className =
      "absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50";
    document.body.appendChild(tooltip);
  }

  const safetyLevel = zone.classList.contains("safety-high")
    ? "High Safety"
    : zone.classList.contains("safety-medium")
    ? "Medium Safety"
    : "Low Safety";

  tooltip.textContent = safetyLevel;
  tooltip.style.left = e.pageX + 10 + "px";
  tooltip.style.top = e.pageY - 30 + "px";
  tooltip.style.display = "block";
}

function hideSafetyTooltip() {
  const tooltip = document.getElementById("safety-tooltip");
  if (tooltip) {
    tooltip.style.display = "none";
  }
}

function refreshHeatmap() {
  // Simulate data refresh with animation
  const safetyZones = document.querySelectorAll(".safety-zone");
  safetyZones.forEach((zone, index) => {
    setTimeout(() => {
      zone.style.animation = "pulse 0.5s ease-in-out";
      setTimeout(() => {
        zone.style.animation = "";
      }, 500);
    }, index * 100);
  });

  setTimeout(() => {
    alert(
      "🔄 Safety heatmap refreshed with real-time data from all major cities!"
    );
  }, 1000);
}

// Initialize the application
document.addEventListener("DOMContentLoaded", function () {
  // Show map section by default
  showSection("map");

  // Initialize interactive map
  initializeMap();

  // Simulate real-time updates
  setInterval(() => {
    // Update notification badge occasionally
    const badge = document.querySelector(".notification-badge");
    if (Math.random() > 0.95) {
      const currentCount = parseInt(badge.textContent);
      badge.textContent = currentCount + 1;
    }
  }, 10000);
});

(function () {
  function c() {
    var b = a.contentDocument || a.contentWindow.document;
    if (b) {
      var d = b.createElement("script");
      d.innerHTML =
        "window.__CF$cv$params={r:'98c8019882ee7f3a',t:'MTc2MDExOTExMC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";
      b.getElementsByTagName("head")[0].appendChild(d);
    }
  }
  if (document.body) {
    var a = document.createElement("iframe");
    a.height = 1;
    a.width = 1;
    a.style.position = "absolute";
    a.style.top = 0;
    a.style.left = 0;
    a.style.border = "none";
    a.style.visibility = "hidden";
    document.body.appendChild(a);
    if ("loading" !== document.readyState) c();
    else if (window.addEventListener)
      document.addEventListener("DOMContentLoaded", c);
    else {
      var e = document.onreadystatechange || function () {};
      document.onreadystatechange = function (b) {
        e(b);
        "loading" !== document.readyState &&
          ((document.onreadystatechange = e), c());
      };
    }
  }
})();
