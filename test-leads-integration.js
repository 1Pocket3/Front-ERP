// Тестовый скрипт для проверки интеграции с API лидов
// Запустить в консоли браузера на странице /leads

console.log('🧪 Тестирование интеграции с API лидов...');

// Функция для тестирования API
async function testLeadsAPI() {
  const baseURL = 'http://127.0.0.1:8000/leads';
  
  try {
    // Тест 1: Получение списка лидов
    console.log('📋 Тест 1: Получение списка лидов...');
    const response = await fetch(`${baseURL}/list/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Список лидов получен:', data);
    } else {
      console.error('❌ Ошибка получения списка лидов:', response.status, response.statusText);
    }
    
    // Тест 2: Создание тестового лида
    console.log('📝 Тест 2: Создание тестового лида...');
    const testLead = {
      first_name: 'Тест',
      last_name: 'Пользователь',
      phone: '+7-900-123-45-67',
      email: 'test@example.com',
      company: 'Тестовая компания',
      lead_source: 'Тест'
    };
    
    const createResponse = await fetch(`${baseURL}/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testLead)
    });
    
    if (createResponse.ok) {
      const createdLead = await createResponse.json();
      console.log('✅ Лид создан:', createdLead);
      
      // Тест 3: Получение созданного лида
      console.log('🔍 Тест 3: Получение созданного лида...');
      const getResponse = await fetch(`${baseURL}/${createdLead.id}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (getResponse.ok) {
        const leadData = await getResponse.json();
        console.log('✅ Лид получен:', leadData);
      } else {
        console.error('❌ Ошибка получения лида:', getResponse.status, getResponse.statusText);
      }
      
      // Тест 4: Обновление лида
      console.log('✏️ Тест 4: Обновление лида...');
      const updateData = {
        ...testLead,
        company: 'Обновленная тестовая компания'
      };
      
      const updateResponse = await fetch(`${baseURL}/${createdLead.id}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (updateResponse.ok) {
        const updatedLead = await updateResponse.json();
        console.log('✅ Лид обновлен:', updatedLead);
      } else {
        console.error('❌ Ошибка обновления лида:', updateResponse.status, updateResponse.statusText);
      }
      
      // Тест 5: Удаление лида
      console.log('🗑️ Тест 5: Удаление лида...');
      const deleteResponse = await fetch(`${baseURL}/${createdLead.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (deleteResponse.ok) {
        console.log('✅ Лид удален');
      } else {
        console.error('❌ Ошибка удаления лида:', deleteResponse.status, deleteResponse.statusText);
      }
      
    } else {
      console.error('❌ Ошибка создания лида:', createResponse.status, createResponse.statusText);
    }
    
  } catch (error) {
    console.error('❌ Ошибка тестирования API:', error);
  }
}

// Функция для проверки аутентификации
function checkAuth() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('❌ Токен аутентификации не найден. Сначала войдите в систему.');
    return false;
  }
  console.log('✅ Токен аутентификации найден');
  return true;
}

// Запуск тестов
if (checkAuth()) {
  testLeadsAPI();
} else {
  console.log('💡 Для запуска тестов сначала войдите в систему через /auth');
}
