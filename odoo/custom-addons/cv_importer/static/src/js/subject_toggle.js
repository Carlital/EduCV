(function() {
  'use strict';

  // 🔹 Toggle de materias por carrera
  function initSubjectToggle() {
    console.log('🔧 Inicializando toggle de materias...');
    
    try {
      const groups = document.querySelectorAll('.grupo-carrera-perfil-fie');
      console.log(`📊 Encontrados ${groups.length} grupos de carrera`);

      groups.forEach(function(group, index) {
        const btn = group.querySelector('.eur-carrera-toggle');
        const list = group.querySelector('.eur-carrera-content');

        if (!btn || !list) {
          console.warn(`⚠️ Grupo ${index + 1}: Falta botón o lista`);
          return;
        }

        console.log(`✅ Configurando grupo ${index + 1}`);

        // Limpiar event listeners previos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Asegurar estado inicial OCULTO
        list.classList.add('d-none');
        list.style.display = 'none';
        newBtn.setAttribute('aria-expanded', 'false');
        newBtn.classList.add('collapsed');

        // Configurar textos
        const showSpan = newBtn.querySelector('.when-collapsed');
        const hideSpan = newBtn.querySelector('.when-not-collapsed');
        
        if (showSpan) showSpan.style.display = '';
        if (hideSpan) hideSpan.style.display = 'none';

        // Event listener para toggle
        newBtn.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isHidden = list.classList.contains('d-none');
          console.log(`🔄 Click en grupo ${index + 1}, oculto: ${isHidden}`);

          if (isHidden) {
            // MOSTRAR
            list.classList.remove('d-none');
            list.style.display = '';
            newBtn.classList.remove('collapsed');
            newBtn.setAttribute('aria-expanded', 'true');
            if (showSpan) showSpan.style.display = 'none';
            if (hideSpan) hideSpan.style.display = '';
            console.log(`👁️ Mostrado grupo ${index + 1}`);
          } else {
            // OCULTAR
            list.classList.add('d-none');
            list.style.display = 'none';
            newBtn.classList.add('collapsed');
            newBtn.setAttribute('aria-expanded', 'false');
            if (showSpan) showSpan.style.display = '';
            if (hideSpan) hideSpan.style.display = 'none';
            console.log(`🙈 Ocultado grupo ${index + 1}`);
          }
        });
      });

      console.log('✅ Toggle de materias inicializado correctamente');
    } catch (e) {
      console.error('❌ Error en initSubjectToggle:', e);
    }
  }

  // 🔹 FUNCIÓN GENÉRICA DE PAGINACIÓN PARA AGRUPADOS / LISTAS
  function initGroupedPagination(options) {
    const {
      containerSelector,
      groupSelector,
      pageSize = 3,
      debugLabel = 'grupos'
    } = options;

    console.log(`📄 Inicializando paginación para ${debugLabel}...`);
    
    try {
      document.querySelectorAll(containerSelector).forEach(function(container, containerIndex) {
        const groups = Array.from(container.querySelectorAll(groupSelector));
        const total = groups.length;
        const totalPages = Math.ceil(total / pageSize);

        console.log(`📊 [${debugLabel} #${containerIndex + 1}] Total items: ${total}, Páginas: ${totalPages}`);

        if (totalPages <= 1) {
          console.log(`ℹ️ [${debugLabel} #${containerIndex + 1}] No se necesita paginación (1 página o menos)`);
          return;
        }

        // Limpiar paginadores existentes justo después del contenedor
        const existingPager = container.nextElementSibling;
        if (existingPager && existingPager.classList.contains('eur-pager')) {
          existingPager.remove();
        }

        // Crear paginador
        const pager = document.createElement('div');
        pager.className = 'eur-pager mt-3 d-flex justify-content-center align-items-center gap-2';
        pager.style.cssText = 'padding: 1rem; background: rgba(181,0,24,0.05); border-radius: 10px;';

        const prevBtn = document.createElement('button');
        prevBtn.className = 'eur-page-btn eur-prev btn btn-sm btn-outline-secondary';
        prevBtn.innerHTML = '&lsaquo;';
        prevBtn.style.cssText = 'min-width: 40px;';
        pager.appendChild(prevBtn);

        const pageBtns = [];
        for (let p = 1; p <= totalPages; p++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'eur-page-btn btn btn-sm btn-outline-secondary';
          pageBtn.textContent = p;
          pageBtn.dataset.page = p;
          pageBtn.style.cssText = 'min-width: 40px;';
          pager.appendChild(pageBtn);
          pageBtns.push(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'eur-page-btn eur-next btn btn-sm btn-outline-secondary';
        nextBtn.innerHTML = '&rsaquo;';
        nextBtn.style.cssText = 'min-width: 40px;';
        pager.appendChild(nextBtn);

        container.parentNode.insertBefore(pager, container.nextSibling);

        let currentPage = 1;

        function renderPage() {
          const start = (currentPage - 1) * pageSize;
          const end = Math.min(start + pageSize, total);

          console.log(`📄 [${debugLabel} #${containerIndex + 1}] Renderizando página ${currentPage} (${start} a ${end - 1})`);

          // Mostrar/ocultar grupos o items
          groups.forEach(function(group, idx) {
            if (idx >= start && idx < end) {
              group.style.display = '';
              group.classList.remove('d-none');
            } else {
              group.style.display = 'none';
              group.classList.add('d-none');
            }
          });

          // Actualizar botones
          pageBtns.forEach(function(btn, idx) {
            if (idx + 1 === currentPage) {
              btn.classList.remove('btn-outline-secondary');
              btn.classList.add('btn-primary');
            } else {
              btn.classList.remove('btn-primary');
              btn.classList.add('btn-outline-secondary');
            }
          });

          prevBtn.disabled = currentPage === 1;
          nextBtn.disabled = currentPage === totalPages;
        }

        // Event listeners del paginador
        pager.addEventListener('click', function(ev) {
          const target = ev.target;
          
          if (target.classList.contains('eur-prev') && currentPage > 1) {
            currentPage--;
            renderPage();
          } else if (target.classList.contains('eur-next') && currentPage < totalPages) {
            currentPage++;
            renderPage();
          } else if (target.dataset.page) {
            currentPage = parseInt(target.dataset.page);
            renderPage();
          }
        });

        renderPage();
        console.log(`✅ [${debugLabel} #${containerIndex + 1}] Paginación inicializada correctamente`);
      });
    } catch (e) {
      console.error(`❌ Error en initGroupedPagination (${debugLabel}):`, e);
    }
  }

  // 🔹 Toggle detalles de publicaciones (si lo usas en tu futuro template)
  function initPublicationToggle() {
    console.log('📚 Inicializando toggle de publicaciones...');
    
    try {
      const pubToggles = document.querySelectorAll('.pub-toggle-detalles');
      console.log(`📊 Encontrados ${pubToggles.length} toggles de publicaciones`);

      pubToggles.forEach(function(btn, index) {
        const content = btn.nextElementSibling;
        
        if (!content || !content.classList.contains('pub-detalles-content')) {
          console.warn(`⚠️ Toggle ${index + 1}: Falta contenido de detalles`);
          return;
        }

        console.log(`✅ Configurando toggle publicación ${index + 1}`);

        // Limpiar event listeners previos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Obtener el nuevo contenido después del reemplazo
        const newContent = newBtn.nextElementSibling;

        // Asegurar estado inicial OCULTO
        newContent.classList.add('d-none');
        newContent.style.display = 'none';
        newBtn.setAttribute('aria-expanded', 'false');

        // Event listener para toggle
        newBtn.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isHidden = newContent.classList.contains('d-none');
          console.log(`🔄 Click en publicación ${index + 1}, oculto: ${isHidden}`);

          if (isHidden) {
            // MOSTRAR
            newContent.classList.remove('d-none');
            newContent.style.display = '';
            newBtn.setAttribute('aria-expanded', 'true');
            console.log(`👁️ Mostrado detalles publicación ${index + 1}`);
          } else {
            // OCULTAR
            newContent.classList.add('d-none');
            newContent.style.display = 'none';
            newBtn.setAttribute('aria-expanded', 'false');
            console.log(`🙈 Ocultado detalles publicación ${index + 1}`);
          }
        });
      });

      console.log('✅ Toggle de publicaciones inicializado correctamente');
    } catch (e) {
      console.error('❌ Error en initPublicationToggle:', e);
    }
  }

  // 🔹 Tabs de publicaciones (Artículos / Congresos / Libros)
  function initPublicationTabs() {
    console.log('📑 Inicializando tabs de publicaciones...');
    
    try {
      const tabsContainer = document.querySelector('.pub-tabs-nav');
      if (!tabsContainer) {
        console.log('ℹ️ No se encontraron tabs de publicaciones');
        return;
      }

      const tabLinks = tabsContainer.querySelectorAll('.nav-link');

      console.log(`📊 Encontrados ${tabLinks.length} tabs`);

      tabLinks.forEach(function(link, index) {
        // Limpiar event listeners previos
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();

          const targetId = newLink.getAttribute('href').substring(1); // Quitar el #
          console.log(`🔄 Click en tab: ${targetId}`);

          // Desactivar todos los tabs
          document.querySelectorAll('.pub-tabs-nav .nav-link').forEach(function(t) {
            t.classList.remove('active');
          });

          // Activar el tab clickeado
          newLink.classList.add('active');

          // Ocultar todos los contenidos
          document.querySelectorAll('.pub-tabs-content .tab-pane').forEach(function(pane) {
            pane.classList.remove('show', 'active');
          });

          // Mostrar el contenido correspondiente
          const targetPane = document.getElementById(targetId);
          if (targetPane) {
            targetPane.classList.add('show', 'active');
            console.log(`✅ Mostrado contenido de: ${targetId}`);
          } else {
            console.warn(`⚠️ No se encontró el contenido para: ${targetId}`);
          }
        });

        console.log(`✅ Configurado tab ${index + 1}`);
      });

      console.log('✅ Tabs de publicaciones inicializados correctamente');
    } catch (e) {
      console.error('❌ Error en initPublicationTabs:', e);
    }
  }

  // 🔹 Toggle de detalles de logros (para versiones futuras)
  function initLogrosToggle() {
    console.log('🏆 Inicializando toggle de logros...');
    
    try {
      const logrosToggles = document.querySelectorAll('.logro-toggle-detalles');
      console.log(`📊 Encontrados ${logrosToggles.length} toggles de logros`);

      logrosToggles.forEach(function(btn, index) {
        const content = btn.nextElementSibling;
        
        if (!content || !content.classList.contains('logro-detalles-content')) {
          console.warn(`⚠️ Toggle logro ${index + 1}: Falta contenido de detalles`);
          return;
        }

        console.log(`✅ Configurando toggle logro ${index + 1}`);

        // Limpiar event listeners previos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Obtener el nuevo contenido después del reemplazo
        const newContent = newBtn.nextElementSibling;

        // Asegurar estado inicial OCULTO
        newContent.classList.add('d-none');
        newContent.style.display = 'none';
        newBtn.setAttribute('aria-expanded', 'false');

        // Event listener para toggle
        newBtn.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isHidden = newContent.classList.contains('d-none');
          console.log(`🔄 Click en logro ${index + 1}, oculto: ${isHidden}`);

          if (isHidden) {
            // MOSTRAR
            newContent.classList.remove('d-none');
            newContent.style.display = '';
            newBtn.setAttribute('aria-expanded', 'true');
            console.log(`👁️ Mostrado detalles logro ${index + 1}`);
          } else {
            // OCULTAR
            newContent.classList.add('d-none');
            newContent.style.display = 'none';
            newBtn.setAttribute('aria-expanded', 'false');
            console.log(`🙈 Ocultado detalles logro ${index + 1}`);
          }
        });
      });

      console.log('✅ Toggle de logros inicializado correctamente');
    } catch (e) {
      console.error('❌ Error en initLogrosToggle:', e);
    }
  }

  // 🔹 Toggle de certificaciones por institución
  function initCertificacionesToggle() {
    console.log('📜 Inicializando toggle de certificaciones...');
    
    try {
      const groups = document.querySelectorAll('.grupo-institucion-perfil-fie');
      console.log(`📊 Encontrados ${groups.length} grupos de certificaciones`);

      groups.forEach(function(group, index) {
        const btn = group.querySelector('.eur-cert-toggle');
        const list = group.querySelector('.eur-cert-content');

        if (!btn || !list) {
          console.warn(`⚠️ Grupo certificación ${index + 1}: Falta botón o lista`);
          return;
        }

        console.log(`✅ Configurando grupo certificación ${index + 1}`);

        // Limpiar event listeners previos
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        // Asegurar estado inicial OCULTO
        list.classList.add('d-none');
        list.style.display = 'none';
        newBtn.setAttribute('aria-expanded', 'false');
        newBtn.classList.add('collapsed');

        // Configurar textos
        const showSpan = newBtn.querySelector('.when-collapsed');
        const hideSpan = newBtn.querySelector('.when-not-collapsed');
        
        if (showSpan) showSpan.style.display = '';
        if (hideSpan) hideSpan.style.display = 'none';

        // Event listener para toggle
        newBtn.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isHidden = list.classList.contains('d-none');
          console.log(`🔄 Click en certificación ${index + 1}, oculto: ${isHidden}`);

          if (isHidden) {
            // MOSTRAR
            list.classList.remove('d-none');
            list.style.display = '';
            newBtn.classList.remove('collapsed');
            newBtn.setAttribute('aria-expanded', 'true');
            if (showSpan) showSpan.style.display = 'none';
            if (hideSpan) hideSpan.style.display = '';
            console.log(`👁️ Mostrado certificaciones ${index + 1}`);
          } else {
            // OCULTAR
            list.classList.add('d-none');
            list.style.display = 'none';
            newBtn.classList.add('collapsed');
            newBtn.setAttribute('aria-expanded', 'false');
            if (showSpan) showSpan.style.display = '';
            if (hideSpan) hideSpan.style.display = 'none';
            console.log(`🙈 Ocultado certificaciones ${index + 1}`);
          }
        });
      });

      console.log('✅ Toggle de certificaciones inicializado correctamente');
    } catch (e) {
      console.error('❌ Error en initCertificacionesToggle:', e);
    }
  }

  // 🔹 Secciones colapsables (Presentación, Títulos, Materias, Métricas, etc.)
  function initSectionCollapse() {
    console.log('📦 Inicializando secciones colapsables...');

    try {
      const sections = document.querySelectorAll('section.content-card');

      sections.forEach(function(section, index) {
        const header = section.querySelector(
          '.eur-section-header, .seccion-encabezado-docencia-perfil, .languages-header'
        );
        const body = section.querySelector('.eur-section-body');

        // Solo si la sección fue marcada con .eur-section-body
        if (!header || !body) {
          return;
        }

        console.log(`✅ Sección colapsable #${index + 1}`);

        // Estado inicial: OCULTO (solo con clases, sin inline styles)
        section.classList.add('eur-section-collapsed');
        section.classList.remove('eur-section-expanded');
        body.classList.remove('eur-section-body--open');

        // Cursor clickable
        header.style.cursor = 'pointer';

        header.addEventListener('click', function(ev) {
          ev.preventDefault();
          ev.stopPropagation();

          const isCollapsed = section.classList.contains('eur-section-collapsed');

          if (isCollapsed) {
            // MOSTRAR
            section.classList.remove('eur-section-collapsed');
            section.classList.add('eur-section-expanded');
            body.classList.add('eur-section-body--open');
          } else {
            // OCULTAR
            section.classList.remove('eur-section-expanded');
            section.classList.add('eur-section-collapsed');
            body.classList.remove('eur-section-body--open');
          }

          // Rotar chevron si existe
          const chev = header.querySelector('.eur-section-chevron i');
          if (chev) {
            chev.style.transform = isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)';
          }
        });
      });

      console.log('✅ Secciones colapsables inicializadas');
    } catch (e) {
      console.error('❌ Error en initSectionCollapse:', e);
    }
  }

  // 🔹 Inicializar paginación para asignaturas, certificaciones, logros e experiencia laboral
  function initAllPagination() {
    // ASIGNATURAS (por carrera)
    initGroupedPagination({
      containerSelector: '.asignaturas-agrupadas-perfil-fie',
      groupSelector: '.grupo-carrera-perfil-fie',
      pageSize: 3,
      debugLabel: 'asignaturas'
    });

    // CERTIFICACIONES (por institución)
    initGroupedPagination({
      containerSelector: '.certificaciones-agrupadas-perfil-fie',
      groupSelector: '.grupo-institucion-perfil-fie',
      pageSize: 3,
      debugLabel: 'certificaciones'
    });

    // LOGROS (lista simple, también se aplica a Idiomas porque comparten clases)
    initGroupedPagination({
      containerSelector: '.logros-lista-mejorada',
      groupSelector: '.logro-item-mejorado',
      pageSize: 3,
      debugLabel: 'logros_e_idiomas'
    });

    // EXPERIENCIA PROFESIONAL (lista simple con el nuevo estilo de publicaciones)
    // Solo se aplica dentro del tab de Práctica (#eur_practica)
    initGroupedPagination({
      containerSelector: '#eur_practica .publicaciones-lista-mejorada',
      groupSelector: '.pub-item-mejorado',
      pageSize: 3,
      debugLabel: 'experiencia_profesional'
    });
  }

  // 🧷 Hook de inicialización
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      console.log('🚀 DOM cargado, iniciando scripts...');
      initSubjectToggle();
      initPublicationToggle();
      initPublicationTabs();
      initLogrosToggle();
      initCertificacionesToggle();
      setTimeout(initAllPagination, 100);
      setTimeout(initSectionCollapse, 150);
    });
  } else {
    console.log('🚀 Iniciando scripts inmediatamente...');
    initSubjectToggle();
    initPublicationToggle();
    initPublicationTabs();
    initLogrosToggle();
    initCertificacionesToggle();
    setTimeout(initAllPagination, 100);
    setTimeout(initSectionCollapse, 150);
  }

})();
