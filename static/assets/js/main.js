(function() {
    "use strict";
  
    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }
  
    /**
     * Easy event listener function
     */
    const on = (type, el, listener, all = false) => {
      if (all) {
        select(el, all).forEach(e => e.addEventListener(type, listener))
      } else {
        select(el, all).addEventListener(type, listener)
      }
    }
  
    /**
     * Easy on scroll event listener 
     */
    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }
  
    /**
     * Sidebar toggle
     */
    if (select('.toggle-sidebar-btn')) {
      on('click', '.toggle-sidebar-btn', function(e) {
        select('body').classList.toggle('toggle-sidebar')
      })
    }
  
    /**
     * Search bar toggle
     */
    if (select('.search-bar-toggle')) {
      on('click', '.search-bar-toggle', function(e) {
        select('.search-bar').classList.toggle('search-bar-show')
      })
    }
  
    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)
  
    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
        } else {
          selectHeader.classList.remove('header-scrolled')
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }
  
    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }
  
    /**
     * Initiate tooltips
     */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })
  
    /**
     * Initiate quill editors
     */
    if (select('.quill-editor-default')) {
      new Quill('.quill-editor-default', {
        theme: 'snow'
      });
    }
  
    if (select('.quill-editor-bubble')) {
      new Quill('.quill-editor-bubble', {
        theme: 'bubble'
      });
    }
  
    if (select('.quill-editor-full')) {
      new Quill(".quill-editor-full", {
        modules: {
          toolbar: [
            [{
              font: []
            }, {
              size: []
            }],
            ["bold", "italic", "underline", "strike"],
            [{
                color: []
              },
              {
                background: []
              }
            ],
            [{
                script: "super"
              },
              {
                script: "sub"
              }
            ],
            [{
                list: "ordered"
              },
              {
                list: "bullet"
              },
              {
                indent: "-1"
              },
              {
                indent: "+1"
              }
            ],
            ["direction", {
              align: []
            }],
            ["link", "image", "video"],
            ["clean"]
          ]
        },
        theme: "snow"
      });
    }
  
  
    /**
     * Initiate Bootstrap validation check
     */
    var needsValidation = document.querySelectorAll('.needs-validation')
  
    Array.prototype.slice.call(needsValidation)
      .forEach(function(form) {
        form.addEventListener('submit', function(event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  
  
      $('#searchField').on('input', function() {
        let query = $(this).val();
        
        if (query !== '') {
            jQuery.ajax({
                url: base_url + 'search_staff',
                method: 'POST',
                data: { query: query },
                success: function(data) {
                    displayResults(data);
                }
            });
        } else {
            $('#searchResults').hide();
        }
    });
  
    function displayResults(data) {
      $('#searchResults').empty();
      data = JSON.parse(data);
      console.log(data);
      if (data.length > 0) {
          data.forEach(function(result) {
              // Access the id and name from the result
              var listItem = $('<li>' + result.name + '</li>');
              $('#searchResults').append(listItem);
  
              // Click event handling for selecting the search result
              listItem.on('click', function() {
                $('#searchField').val(result.name);
                $('#userIdField').val(result.id); // Store the user ID in the hidden field
                $('#searchResults').hide();
            });
          });
          $('#searchResults').show();
      } else {
          $('#searchResults').hide();
      }
    }
  
  
    // Hide results when clicking outside the input and results
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.col-md-4').length) {
            $('#searchResults').hide();
        }
    });
  
    // Click event handling for dynamically created list items
    $('#searchResults').on('click', 'li', function() {
        $('#searchField').val($(this).text());
        $('#searchResults').hide();
    });
  
    
  
    $('.attendance').DataTable({
  
      "lengthMenu": [[100, 50, -1], [100, 50, "All"]],
      "pageLength": 100,  // Set the default number of entries to 5
     
      dom: 'Bfrtip',
      buttons: [
          'excelHtml5', 'print'
      ],
  
      columnDefs: [
          { 
            type: 'datetime-moment', targets: [5]
           }, // Assuming your date column is the first column (index 0)
      ],
      order: [[5, 'desc']],
    
    });
    $('.datatable').DataTable({
  
      "lengthMenu": [[100, 50, -1], [100, 50, "All"]],
      "pageLength": 100,  // Set the default number of entries to 5
     
      dom: 'Bfrtip',
      buttons: [
          'excelHtml5', 'print'
      ],
  
      columnDefs: [
          { 
            type: 'datetime-moment', targets: [3]
           }, // Assuming your date column is the first column (index 0)
      ],
      order: [[3, 'desc']],
    
    });
    $('.meetings-datatable').DataTable({
  
      "lengthMenu": [[100, 50, -1], [100, 50, "All"]],
      "pageLength": 100,  // Set the default number of entries to 5
     
      dom: 'Bfrtip',
      buttons: [
          'excelHtml5', 'print'
      ],
  
      columnDefs: [
          { 
            type: 'datetime-moment', targets: [4]
           }, // Assuming your date column is the first column (index 0)
      ],
      order: [[4, 'desc']],
    });
   $('.userstable').DataTable({
    "lengthMenu": [[300, 100, 50, -1], [300, 100, 50, "All"]],
    "pageLength": 300,  // Set the default number of entries to 300
    order: [[0, 'asc']],
    dom: 'Bfrtip',
    buttons: [
        {
            extend: 'excelHtml5',
            text: 'Export to Excel',
            exportOptions: {
                columns: [0, 1, 2, 3, 4, 5]  // Specify the column indices you want to export
            }
        },
        {
            extend: 'print',
            text: 'Print',
            exportOptions: {
                 columns: [0, 1, 2, 3, 4, 5]  // Specify the column indices you want to print
            }
        }
    ],
    });

   
    $('.logs-table').DataTable({
  
      "lengthMenu": [[100, 50, -1], [100, 50, "All"]],
      "pageLength": 100,  // Set the default number of entries to 5
     
      // dom: 'Bfrtip',
      // buttons: [
      //     'excel', 'print'
      // ],
  
      columnDefs: [
          { type: 'datetime-moment', targets: [2],
            
           }, // Assuming your date column is the first column (index 0)
      ],
      order: [[2, 'desc']],
    
    });
    $('.disable-user').on('click', function(e) {
      e.preventDefault();
      
      var userConfirmed = confirm('Are you sure you want to disable this user?');
      if (!userConfirmed) {
          return; // Exit if the user clicks "Cancel"
      }
  
      var userId = $(this).data('id');
      var row = $(this).closest('tr');
  
      $.ajax({
          url: base_url + 'disable_user/' + userId,
          type: 'POST',
          success: function(response) {
              if (response.success) {
                  row.find('td:eq(4)').text('Disabled'); // Update the status in the row
              } else {
                  alert(response.message);
              }
          },
          error: function() {
              alert('An error occurred. Please try again.');
          }
      });
  });
  $('.enable-user').on('click', function(e) {
    e.preventDefault();
    
    var userConfirmed = confirm('Are you sure you want to activate this user?');
    if (!userConfirmed) {
        return; // Exit if the user clicks "Cancel"
    }
  
    var userId = $(this).data('id');
    var row = $(this).closest('tr');
  
    $.ajax({
        url: base_url + 'enable_user/' + userId,
        type: 'POST',
        success: function(response) {
            if (response.success) {
                row.find('td:eq(4)').text('Active'); // Update the status in the row
            } else {
                alert(response.message);
            }
        },
        error: function() {
            alert('An error occurred. Please try again.');
        }
    });
  });
  
  //   $('.datatable').DataTable({
  //     "pageLength": 100,
  //     dom: 'Bfrtip', // This parameter is for buttons
  //     buttons: [
  //         'csv', 'print'
  //     ]
  // });
    /**
     * Autoresize echart charts
     */
    const mainContainer = select('#main');
    if (mainContainer) {
      setTimeout(() => {
        new ResizeObserver(function() {
          select('.echart', true).forEach(getEchart => {
            echarts.getInstanceByDom(getEchart).resize();
          })
        }).observe(mainContainer);
      }, 200);
    }
  
  })();
  
  $('#current-password-toggle').click(function () {
    var passwordField = $('#current-password-field');
    var passwordToggle = $('#current-password-toggle');
  
    if (passwordField.attr('type') == 'password') {
        passwordField.attr('type', 'text');
        passwordToggle.html('<i class="bi bi-eye-slash"></i>');
    } else {
        passwordField.attr('type', 'password');
        passwordToggle.html('<i class="bi bi-eye" aria-hidden="true"></i>');
    }
  });
  
  // Toggle new password field
  $('#new-password-toggle').click(function () {
    var passwordField = $('#new-password-field');
    var passwordToggle = $('#new-password-toggle');
  
    if (passwordField.attr('type') == 'password') {
        passwordField.attr('type', 'text');
        passwordToggle.html('<i class="bi bi-eye-slash" aria-hidden="true"></i>');
    } else {
        passwordField.attr('type', 'password');
        passwordToggle.html('<i class="bi bi-eye" aria-hidden="true"></i>');
    }
  });
  
  // Toggle confirm password field
  $('#confirm-password-toggle').click(function () {
    var passwordField = $('#confirm-password-field');
    var passwordToggle = $('#confirm-password-toggle');
  
    if (passwordField.attr('type') == 'password') {
        passwordField.attr('type', 'text');
        passwordToggle.html('<i class="bi bi-eye-slash"></i>');
    } else {
        passwordField.attr('type', 'password');
        passwordToggle.html('<i class="bi bi-eye"></i>');
    }
  });
    