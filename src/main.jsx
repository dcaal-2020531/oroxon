document.getElementById('loadUsersButton').addEventListener('click', async () => {
  try {
    const response = await fetch('http://localhost:1998/api/users');
    const result = await response.json();

    if (response.ok) {
      const usersList = document.getElementById('usersList');
      usersList.innerHTML = `
        <h3>Usuarios:</h3>
        <ul>
          ${result.users.map(user => `
            <li>
              ID: ${user._id}, Nombre: ${user.username}, Correo: ${user.email}
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Hubo un error al cargar los usuarios.');
  }
});

// Actualizar perfil de usuario
document.getElementById('updateUserButton').addEventListener('click', async () => {
  const userId = document.getElementById('updateUserId').value;
  const username = document.getElementById('updateUsername').value;
  const email = document.getElementById('updateEmail').value;

  if (!userId || !username || !email) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Perfil actualizado con éxito');
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Hubo un error al actualizar el perfil.');
  }
});

// Eliminar perfil de usuario
document.getElementById('deleteUserButton').addEventListener('click', async () => {
  const userId = document.getElementById('deleteUserId').value;
  const currentPassword = document.getElementById('currentPassword').value;

  if (!userId || !currentPassword) {
    alert('Por favor, ingrese el ID y la contraseña.');
    return;
  }

  const confirmation = window.confirm('¿Estás seguro de eliminar este usuario?');

  if (!confirmation) {
    return;
  }

  try {
    const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword }),
    });

    const result = await response.json();

    if (response.ok) {
      alert('Usuario eliminado con éxito');
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Hubo un error al eliminar el usuario.');
  }
});
// Crear cliente
document.getElementById('createClientBtn').addEventListener('click', async () => {
  const name = document.getElementById('clientName').value;
  const contact = document.getElementById('clientContact').value;
  const company = document.getElementById('clientCompany').value;

  try {
    const res = await fetch(`${API_BASE}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, company })
    });
    const data = await res.json();
    alert(data.mensaje);
  } catch (err) {
    console.error(err);
    alert('Error al crear cliente');
  }
});

// Obtener todos los clientes activos
document.getElementById('getAllClientsBtn').addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/clientes`);
    const data = await res.json();
    const list = document.getElementById('clientsList');
    list.innerHTML = data.map(c => `<li>ID: ${c._id} - ${c.name} (${c.company})</li>`).join('');
  } catch (err) {
    console.error(err);
    alert('Error al obtener clientes');
  }
});

// Buscar cliente por ID
document.getElementById('searchClientBtn').addEventListener('click', async () => {
  const id = document.getElementById('clientIdSearch').value;
  try {
    const res = await fetch(`${API_BASE}/clientes/${id}`);
    const data = await res.json();
    if (res.ok) {
      document.getElementById('clientDetails').innerText = `Nombre: ${data.name}, Contacto: ${data.contact}, Empresa: ${data.company}`;
    } else {
      alert(data.mensaje || 'Cliente no encontrado');
    }
  } catch (err) {
    console.error(err);
    alert('Error al buscar cliente');
  }
});

// Actualizar cliente
document.getElementById('updateClientBtn').addEventListener('click', async () => {
  const id = document.getElementById('clientIdUpdate').value;
  const name = document.getElementById('clientNameUpdate').value;
  const contact = document.getElementById('clientContactUpdate').value;
  const company = document.getElementById('clientCompanyUpdate').value;

  try {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, company })
    });
    const data = await res.json();
    alert(data.mensaje);
  } catch (err) {
    console.error(err);
    alert('Error al actualizar cliente');
  }
});

// Dar de baja a cliente
document.getElementById('deactivateClientBtn').addEventListener('click', async () => {
  const id = document.getElementById('clientIdDeactivate').value;
  const confirmation = document.getElementById('clientConfirmDeactivate').value;

  if (confirmation !== 'CONFIRMADO') {
    alert('Debes escribir CONFIRMADO para dar de baja');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/clientes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation })
    });
    const data = await res.json();
    alert(data.mensaje);
  } catch (err) {
    console.error(err);
    alert('Error al dar de baja cliente');
  }
});

// Crear producto
document.getElementById('createProductBtn').addEventListener('click', async () => {
  const product = {
    name: document.getElementById('prodName').value,
    price: parseFloat(document.getElementById('prodPrice').value),
    stock: parseInt(document.getElementById('prodStock').value),
    entryDate: document.getElementById('prodEntryDate').value,
    category: document.getElementById('prodCategory').value,
    supplier: document.getElementById('prodSupplier').value
  };

  try {
    const res = await fetch(`${API_BASE}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    alert('Producto creado con éxito');
  } catch (err) {
    console.error(err);
    alert('Error al crear producto');
  }
});

// Filtrar productos
document.getElementById('filterProductsBtn').addEventListener('click', async () => {
  const name = document.getElementById('filterName').value;
  const category = document.getElementById('filterCategory').value;
  const fromDate = document.getElementById('filterFromDate').value;
  const toDate = document.getElementById('filterToDate').value;

  const query = new URLSearchParams({ name, category, fromDate, toDate }).toString();

  try {
    const res = await fetch(`${API_BASE}/productos?${query}`);
    const data = await res.json();
    const list = document.getElementById('productsList');
    list.innerHTML = data.map(p =>
      `<li>ID: ${p._id} - ${p.name} | Stock: ${p.stock} | Precio: ${p.price}</li>`
    ).join('');
  } catch (err) {
    console.error(err);
    alert('Error al obtener productos');
  }
});

// Actualizar producto (stock y precio)
document.getElementById('updateProductBtn').addEventListener('click', async () => {
  const id = document.getElementById('updateProdId').value;
  const stock = document.getElementById('updateProdStock').value;
  const price = document.getElementById('updateProdPrice').value;

  const updateData = {};
  if (stock !== '') updateData.stock = parseInt(stock);
  if (price !== '') updateData.price = parseFloat(price);

  try {
    const res = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // Requiere token si hay auth; puedes agregar: Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    alert(data.message || 'Producto actualizado');
  } catch (err) {
    console.error(err);
    alert('Error al actualizar producto');
  }
});

// Eliminar producto
document.getElementById('deleteProductBtn').addEventListener('click', async () => {
  const id = document.getElementById('deleteProdId').value;

  if (!confirm('¿Seguro que deseas eliminar este producto?')) return;

  try {
    const res = await fetch(`${API_BASE}/productos/${id}`, {
      method: 'DELETE'
    });
    const data = await res.json();
    alert(data.message || 'Producto eliminado');
  } catch (err) {
    console.error(err);
    alert('Error al eliminar producto');
  }
});


// Crear proveedor
document.getElementById('createProveedorBtn').addEventListener('click', async () => {
  const name = document.getElementById('provName').value;
  const contact = document.getElementById('provContact').value;
  const products = document.getElementById('provProducts').value.split(',').map(p => p.trim()).filter(p => p);

  try {
    const res = await fetch(`${API_BASE}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, contact, products })
    });
    const data = await res.json();
    alert(data.mensaje || 'Proveedor creado');
  } catch (err) {
    console.error(err);
    alert('Error al crear proveedor');
  }
});

// Ver proveedores
document.getElementById('loadProveedoresBtn').addEventListener('click', async () => {
  try {
    const res = await fetch(`${API_BASE}/proveedores`);
    const data = await res.json();
    const list = document.getElementById('proveedoresList');
    list.innerHTML = data.map(p =>
      `<li>ID: ${p._id} - ${p.name} | Contacto: ${p.contact} | Productos: ${p.products.map(pr => pr.name || pr).join(', ')}</li>`
    ).join('');
  } catch (err) {
    console.error(err);
    alert('Error al cargar proveedores');
  }
});

// Actualizar proveedor
document.getElementById('updateProveedorBtn').addEventListener('click', async () => {
  const id = document.getElementById('updateProvId').value;
  const name = document.getElementById('updateProvName').value;
  const contact = document.getElementById('updateProvContact').value;
  const productsRaw = document.getElementById('updateProvProducts').value;
  const products = productsRaw ? productsRaw.split(',').map(p => p.trim()) : undefined;

  const data = {};
  if (name) data.name = name;
  if (contact) data.contact = contact;
  if (productsRaw) data.products = products;

  try {
    const res = await fetch(`${API_BASE}/proveedores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    alert(result.mensaje || 'Proveedor actualizado');
  } catch (err) {
    console.error(err);
    alert('Error al actualizar proveedor');
  }
});

// Dar de baja proveedor
document.getElementById('deactivateProveedorBtn').addEventListener('click', async () => {
  const id = document.getElementById('deleteProvId').value;
  if (!confirm('¿Estás seguro de dar de baja este proveedor?')) return;

  try {
    const res = await fetch(`${API_BASE}/proveedores/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'CONFIRM' })
    });
    const data = await res.json();
    alert(data.mensaje || 'Proveedor dado de baja');
  } catch (err) {
    console.error(err);
    alert('Error al dar de baja proveedor');
  }
});



