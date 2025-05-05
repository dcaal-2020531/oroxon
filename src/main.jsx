document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = ['http://localhost:1998/v1/cliente/allclientes','http://localhost:1998/v1/product','http://localhost:1998/v1/category',
    'http://localhost:1998/v1/proveedor','http://localhost:1998/v1/register'
 ];
  ;
  

  const loadUsersButton = document.getElementById('loadUsersButton');
  if (loadUsersButton) {
    loadUsersButton.addEventListener('click', async () => {
      try {
        const response = await fetch(API_BASE);
        const clientes = await response.json();

        if (response.ok) {
          const clientContainer = document.getElementById('usersList'); // Cambiado a usersList
          
          if (clientContainer) {
            let htmlContent = '<h2>Lista de Clientes</h2>';
            
            clientes.forEach(cliente => {
              htmlContent += `
                <div class="cliente-card">
                  <h3>Cliente:</h3>
                  <p>ID: ${cliente._id}</p>
                  <p>Nombre: ${cliente.name}</p>
                  <p>Contacto: ${cliente.contact}</p>
                  <p>Compañía: ${cliente.company}</p>
                  <p>Estado: ${cliente.status ? 'Activo' : 'Inactivo'}</p>
                  <hr>
                </div>
              `;
            });

            clientContainer.innerHTML = htmlContent;
          } else {
            console.error('El contenedor con ID "usersList" no se encontró.');
          }
        } else {
          alert(clientes.message || 'Error al obtener los clientes');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Hubo un error al cargar los clientes.');
      }
    });
  } else {
    console.error('El botón de carga no se encuentra en el DOM.');
  }


  const registerButton = document.getElementById('registerButton');
  if (registerButton) {
      registerButton.addEventListener('click', async () => {
          const name = document.getElementById('registerName').value;
          const username = document.getElementById('registerUsername').value;
          const password = document.getElementById('registerPassword').value;

          if (!name || !username || !password) {
              alert('Por favor complete todos los campos');
              return;
          }

          try {
              const response = await fetch('http://localhost:1998/v1/auth/register', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      name,
                      username,
                      password
                  })
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Usuario registrado con éxito');
                  // Limpiar campos después del registro
                  document.getElementById('registerName').value = '';
                  document.getElementById('registerUsername').value = '';
                  document.getElementById('registerPassword').value = '';
              } else {
                  alert(result.message || 'Error al registrar usuario');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Error al conectar con el servidor');
          }
      });
  } else {
      console.error('El botón de registro no se encuentra en el DOM');
  }

  // Eliminar Perfil de Usuario
  const deleteUserButton = document.getElementById('deleteUserButton');
  if (deleteUserButton) {
      deleteUserButton.addEventListener('click', async () => {
          const userId = document.getElementById('deleteUserId').value.trim();
          const currentPassword = document.getElementById('currentPassword').value.trim();

          if (!userId || !currentPassword) {
              alert('Por favor complete todos los campos');
              return;
          }

          try {
              const response = await fetch(`http://localhost:1998/v1/user/deleteempleyee/${userId}`, {
                  method: 'DELETE',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}` // Asumiendo que guardas el token en localStorage
                  },
                  body: JSON.stringify({
                      currentPassword
                  })
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Usuario eliminado con éxito');
                  // Limpiar campos después de eliminar
                  document.getElementById('deleteUserId').value = '';
                  document.getElementById('currentPassword').value = '';
              } else {
                  alert(result.message || 'Error al eliminar usuario');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Hubo un error al intentar eliminar el usuario');
          }
      });
  }

  // Actualizar Perfil de Usuario
  const updateUserButton = document.getElementById('updateUserButton');
  if (updateUserButton) {
      updateUserButton.addEventListener('click', async () => {
          const userId = document.getElementById('updateUserId').value.trim();
          const newUsername = document.getElementById('updateUsername').value.trim();
          const newEmail = document.getElementById('updateEmail').value.trim();

          if (!userId) {
              alert('El ID de usuario es requerido');
              return;
          }

          try {
              const updates = {};
              if (newUsername) updates.username = newUsername;
              if (newEmail) updates.email = newEmail;

              const response = await fetch(`http://localhost:1998/v1/user/updateemplyee/${userId}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(updates)
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Perfil actualizado con éxito');
                  // Limpiar campos después de actualizar
                  document.getElementById('updateUserId').value = '';
                  document.getElementById('updateUsername').value = '';
                  document.getElementById('updateEmail').value = '';
              } else {
                  alert(result.message || 'Error al actualizar perfil');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Hubo un error al intentar actualizar el perfil');
          }
      });
  }

  const createCategoryBtn = document.getElementById('createCategoryBtn');
  if (createCategoryBtn) {
      createCategoryBtn.addEventListener('click', async () => {
          const name = document.getElementById('catName').value.trim();
          const description = document.getElementById('catDescription').value.trim();

          if (!name || !description) {
              alert('Por favor complete todos los campos');
              return;
          }

          try {
              const response = await fetch(`${API_BASE}/createcategory`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify({ name, description })
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Categoría creada con éxito');
                  document.getElementById('catName').value = '';
                  document.getElementById('catDescription').value = '';
                  // Opcional: Recargar la lista de categorías
                  loadCategories();
              } else {
                  alert(result.message || 'Error al crear categoría');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Error al conectar con el servidor');
          }
      });
  }

  // Listar todas las categorías
  const getAllCategoriesBtn = document.getElementById('getAllCategoriesBtn');
  const categoriesList = document.getElementById('categoriesList');
  
  async function loadCategories() {
      try {
          const response = await fetch(`${API_BASE}/allcategory`, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });
          const result = await response.json();

          if (response.ok) {
              categoriesList.innerHTML = '';
              result.categories.forEach(category => {
                  const li = document.createElement('li');
                  li.innerHTML = `
                      <strong>${category.name}</strong> - ${category.description}
                      <button onclick="editCategoryPrompt('${category._id}', '${category.name}', '${category.description}')">Editar</button>
                      <button onclick="deleteCategory('${category._id}')">Eliminar</button>
                  `;
                  categoriesList.appendChild(li);
              });
          } else {
              alert(result.message || 'Error al cargar categorías');
          }
      } catch (err) {
          console.error('Error:', err);
          alert('Error al cargar categorías');
      }
  }

  if (getAllCategoriesBtn) {
      getAllCategoriesBtn.addEventListener('click', loadCategories);
  }

  // Buscar categoría por ID
  const searchCategoryBtn = document.getElementById('searchCategoryBtn');
  const categoryDetails = document.getElementById('categoryDetails');
  
  if (searchCategoryBtn) {
      searchCategoryBtn.addEventListener('click', async () => {
          const id = document.getElementById('searchCatId').value.trim();
          
          if (!id) {
              alert('Por favor ingrese un ID');
              return;
          }

          try {
              const response = await fetch(`${API_BASE}/category/${id}`, {
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
              });
              const result = await response.json();

              if (response.ok) {
                  categoryDetails.innerHTML = `
                      <h4>Detalles de la categoría</h4>
                      <p><strong>Nombre:</strong> ${result.name}</p>
                      <p><strong>Descripción:</strong> ${result.description}</p>
                      <p><strong>ID:</strong> ${result._id}</p>
                  `;
              } else {
                  alert(result.mensaje || 'Categoría no encontrada');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Error al buscar categoría');
          }
      });
  }

  // Actualizar categoría
  const updateCategoryBtn = document.getElementById('updateCategoryBtn');
  
  if (updateCategoryBtn) {
      updateCategoryBtn.addEventListener('click', async () => {
          const id = document.getElementById('updateCatId').value.trim();
          const name = document.getElementById('updateCatName').value.trim();
          const description = document.getElementById('updateCatDesc').value.trim();

          if (!id || (!name && !description)) {
              alert('Se requiere ID y al menos un campo para actualizar');
              return;
          }

          try {
              const updates = {};
              if (name) updates.name = name;
              if (description) updates.description = description;

              const response = await fetch(`${API_BASE}/editcategory/${id}`, {
                  method: 'PUT',
                  headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(updates)
              });

              const result = await response.json();

              if (response.ok) {
                  alert('Categoría actualizada con éxito');
                  // Limpiar campos
                  document.getElementById('updateCatId').value = '';
                  document.getElementById('updateCatName').value = '';
                  document.getElementById('updateCatDesc').value = '';
                  // Recargar lista
                  loadCategories();
              } else {
                  alert(result.message || 'Error al actualizar categoría');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Error al actualizar categoría');
          }
      });
  }

  // Eliminar categoría
  const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
  
  if (deleteCategoryBtn) {
      deleteCategoryBtn.addEventListener('click', async () => {
          const id = document.getElementById('deleteCatId').value.trim();
          
          if (!id) {
              alert('Por favor ingrese un ID');
              return;
          }

          if (!confirm('¿Está seguro de eliminar esta categoría? Los productos serán reasignados a la categoría predeterminada.')) {
              return;
          }

          try {
              const response = await fetch(`${API_BASE}/deletecategory/${id}`, {
                  method: 'DELETE',
                  headers: {
                      'Authorization': `Bearer ${localStorage.getItem('token')}`
                  }
              });

              const result = await response.json();

              if (response.ok) {
                  alert(result.message || 'Categoría eliminada con éxito');
                  document.getElementById('deleteCatId').value = '';
                  // Recargar lista
                  loadCategories();
              } else {
                  alert(result.message || 'Error al eliminar categoría');
              }
          } catch (err) {
              console.error('Error:', err);
              alert('Error al eliminar categoría');
          }
      });
  }

  // Funciones globales para los botones en la lista
  window.editCategoryPrompt = (id, currentName, currentDesc) => {
      document.getElementById('updateCatId').value = id;
      document.getElementById('updateCatName').value = currentName;
      document.getElementById('updateCatDesc').value = currentDesc;
      window.scrollTo(0, document.getElementById('updateCatId').offsetTop);
  };

  window.deleteCategory = async (id) => {
      if (!confirm('¿Está seguro de eliminar esta categoría?')) return;
      
      try {
          const response = await fetch(`${API_BASE}/deletecategory/${id}`, {
              method: 'DELETE',
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
          });

          const result = await response.json();

          if (response.ok) {
              alert(result.message || 'Categoría eliminada con éxito');
              loadCategories();
          } else {
              alert(result.message || 'Error al eliminar categoría');
          }
      } catch (err) {
          console.error('Error:', err);
          alert('Error al eliminar categoría');
      }
  };

  const createProductBtn = document.getElementById('createProductBtn');
    if (createProductBtn) {
        createProductBtn.addEventListener('click', async () => {
            const name = document.getElementById('prodName').value.trim();
            const price = parseFloat(document.getElementById('prodPrice').value);
            const stock = parseInt(document.getElementById('prodStock').value);
            const entryDate = document.getElementById('prodEntryDate').value;
            const category = document.getElementById('prodCategory').value.trim();
            const supplier = document.getElementById('prodSupplier').value.trim();

            if (!name || !price || !stock || !entryDate || !category) {
                alert('Complete todos los campos obligatorios');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/createproduct`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        price,
                        stock,
                        entryDate,
                        category,
                        supplier
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Producto creado con éxito!');
                    // Limpiar formulario
                    document.getElementById('prodName').value = '';
                    document.getElementById('prodPrice').value = '';
                    document.getElementById('prodStock').value = '';
                    document.getElementById('prodEntryDate').value = '';
                    document.getElementById('prodCategory').value = '';
                    document.getElementById('prodSupplier').value = '';
                } else {
                    throw new Error(result.error || 'Error al crear producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // ==================== LISTAR/FILTRAR PRODUCTOS ====================
    const filterProductsBtn = document.getElementById('filterProductsBtn');
    const productsList = document.getElementById('productsList');

    async function loadProducts() {
        const name = document.getElementById('filterName').value.trim();
        const category = document.getElementById('filterCategory').value.trim();
        const fromDate = document.getElementById('filterFromDate').value;
        const toDate = document.getElementById('filterToDate').value;

        try {
            // Construir query params
            let queryParams = [];
            if (name) queryParams.push(`name=${encodeURIComponent(name)}`);
            if (category) queryParams.push(`category=${category}`);
            if (fromDate) queryParams.push(`fromDate=${fromDate}`);
            if (toDate) queryParams.push(`toDate=${toDate}`);

            const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';

            const response = await fetch(`${API_BASE}/product${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const products = await response.json();

            if (response.ok) {
                productsList.innerHTML = '';
                products.forEach(product => {
                    const li = document.createElement('li');
                    li.className = 'product-item';
                    li.innerHTML = `
                        <div>
                            <strong>${product.name}</strong> - $${product.price}
                            <p>Stock: ${product.stock} | Categoría: ${product.category?.name || 'N/A'}</p>
                            <p>Fecha ingreso: ${new Date(product.entryDate).toLocaleDateString()}</p>
                        </div>
                        <div class="product-actions">
                            <button onclick="showEditProduct('${product._id}')">Editar</button>
                            <button onclick="deleteProduct('${product._id}')">Eliminar</button>
                        </div>
                    `;
                    productsList.appendChild(li);
                });
            } else {
                throw new Error('Error al cargar productos');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }

    if (filterProductsBtn) {
        filterProductsBtn.addEventListener('click', loadProducts);
    }

    // ==================== ACTUALIZAR PRODUCTO ====================
    const updateProductBtn = document.getElementById('updateProductBtn');

    window.showEditProduct = (productId) => {
        // Implementar lógica para cargar los datos del producto en el formulario
        document.getElementById('updateProdId').value = productId;
        // Aquí deberías hacer un fetch para obtener los datos del producto y llenar los campos
        alert(`Modo edición para producto ID: ${productId}`);
    };

    if (updateProductBtn) {
        updateProductBtn.addEventListener('click', async () => {
            const productId = document.getElementById('updateProdId').value.trim();
            const price = parseFloat(document.getElementById('updateProdPrice').value);
            const stock = parseInt(document.getElementById('updateProdStock').value);

            if (!productId || isNaN(price) || isNaN(stock)) {
                alert('Complete todos los campos correctamente');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/editproduct/${productId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        price,
                        stock
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Producto actualizado con éxito!');
                    // Limpiar formulario
                    document.getElementById('updateProdId').value = '';
                    document.getElementById('updateProdPrice').value = '';
                    document.getElementById('updateProdStock').value = '';
                    // Recargar lista
                    loadProducts();
                } else {
                    throw new Error(result.message || 'Error al actualizar producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // ==================== ELIMINAR PRODUCTO ====================
    const deleteProductBtn = document.getElementById('deleteProductBtn');

    window.deleteProduct = async (productId) => {
        if (!confirm('¿Está seguro de eliminar este producto?')) return;

        try {
            const response = await fetch(`${API_BASE}/deleteproduct/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert('Producto eliminado con éxito!');
                loadProducts();
            } else {
                throw new Error(result.error || 'Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    if (deleteProductBtn) {
        deleteProductBtn.addEventListener('click', async () => {
            const productId = document.getElementById('deleteProdId').value.trim();
            if (!productId) {
                alert('Ingrese un ID de producto');
                return;
            }
            await deleteProduct(productId);
            document.getElementById('deleteProdId').value = '';
        });
    }

    // Cargar productos al iniciar
    loadProducts(); 

    const loadProveedoresBtn = document.getElementById('loadProveedoresBtn');
    const proveedoresList = document.getElementById('proveedoresList');

    async function loadProveedores() {
        try {
            const response = await fetch(`${API_BASE}/allproveedores`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const proveedores = await response.json();

            if (response.ok) {
                proveedoresList.innerHTML = '';
                proveedores.forEach(proveedor => {
                    const li = document.createElement('li');
                    li.className = 'proveedor-item';
                    li.innerHTML = `
                        <div>
                            <strong>${proveedor.name}</strong>
                            <p>Contacto: ${proveedor.contact}</p>
                            <p>Productos asociados: ${proveedor.products?.length || 0}</p>
                            <p>Estado: ${proveedor.status ? 'Activo' : 'Inactivo'}</p>
                        </div>
                        <div class="proveedor-actions">
                            <button onclick="showEditProveedor('${proveedor._id}')">Editar</button>
                            <button onclick="showDeleteProveedor('${proveedor._id}')">Dar de baja</button>
                        </div>
                    `;
                    proveedoresList.appendChild(li);
                });
            } else {
                throw new Error('Error al cargar proveedores');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    }

    if (loadProveedoresBtn) {
        loadProveedoresBtn.addEventListener('click', loadProveedores);
    }

    // ==================== CREAR PROVEEDOR ====================
    const createProveedorBtn = document.getElementById('createProveedorBtn');
    if (createProveedorBtn) {
        createProveedorBtn.addEventListener('click', async () => {
            const name = document.getElementById('provName').value.trim();
            const contact = document.getElementById('provContact').value.trim();
            const products = document.getElementById('provProducts').value.trim()
                .split(',')
                .map(id => id.trim())
                .filter(id => id);

            if (!name || !contact) {
                alert('Complete todos los campos obligatorios');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/createproveedor`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        contact,
                        products
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Proveedor creado con éxito!');
                    // Limpiar formulario
                    document.getElementById('provName').value = '';
                    document.getElementById('provContact').value = '';
                    document.getElementById('provProducts').value = '';
                    // Recargar lista
                    loadProveedores();
                } else {
                    throw new Error(result.error || 'Error al crear proveedor');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // ==================== EDITAR PROVEEDOR ====================
    const updateProveedorBtn = document.getElementById('updateProveedorBtn');

    window.showEditProveedor = async (proveedorId) => {
        try {
            const response = await fetch(`${API_BASE}/proveedor/${proveedorId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const proveedor = await response.json();

            if (response.ok) {
                document.getElementById('updateProvId').value = proveedor._id;
                document.getElementById('updateProvName').value = proveedor.name;
                document.getElementById('updateProvContact').value = proveedor.contact;
                document.getElementById('updateProvProducts').value = proveedor.products.join(', ');
                
                // Scroll al formulario de edición
                document.getElementById('updateProvId').scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error(proveedor.error || 'Error al cargar proveedor');
            }
        } catch (error) {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        }
    };

    if (updateProveedorBtn) {
        updateProveedorBtn.addEventListener('click', async () => {
            const proveedorId = document.getElementById('updateProvId').value.trim();
            const name = document.getElementById('updateProvName').value.trim();
            const contact = document.getElementById('updateProvContact').value.trim();
            const products = document.getElementById('updateProvProducts').value.trim()
                .split(',')
                .map(id => id.trim())
                .filter(id => id);

            if (!proveedorId || !name || !contact) {
                alert('Complete todos los campos obligatorios');
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/proveedor/${proveedorId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name,
                        contact,
                        products
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Proveedor actualizado con éxito!');
                    // Limpiar formulario
                    document.getElementById('updateProvId').value = '';
                    document.getElementById('updateProvName').value = '';
                    document.getElementById('updateProvContact').value = '';
                    document.getElementById('updateProvProducts').value = '';
                    // Recargar lista
                    loadProveedores();
                } else {
                    throw new Error(result.error || 'Error al actualizar proveedor');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // ==================== DAR DE BAJA PROVEEDOR ====================
    const deactivateProveedorBtn = document.getElementById('deactivateProveedorBtn');

    window.showDeleteProveedor = (proveedorId) => {
        document.getElementById('deleteProvId').value = proveedorId;
        document.getElementById('deleteProvId').scrollIntoView({ behavior: 'smooth' });
    };

    if (deactivateProveedorBtn) {
        deactivateProveedorBtn.addEventListener('click', async () => {
            const proveedorId = document.getElementById('deleteProvId').value.trim();
            
            if (!proveedorId) {
                alert('Ingrese un ID de proveedor');
                return;
            }

            if (!confirm('¿Está seguro de dar de baja a este proveedor?')) {
                return;
            }

            try {
                const response = await fetch(`${API_BASE}/deleteproveedor/${proveedorId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        confirmation: 'CONFIRM'
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    alert('Proveedor dado de baja con éxito!');
                    document.getElementById('deleteProvId').value = '';
                    loadProveedores();
                } else {
                    throw new Error(result.error || 'Error al dar de baja proveedor');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }

    // Cargar proveedores al iniciar
    loadProveedores();

});