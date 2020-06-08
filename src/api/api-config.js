const env = 'https://chimp.fr'

const api = {
    'login': env + '/api/tokens/token',
    'logout': env + '/api/logout',
    'recipeGet': env + '/api/recipe/{id}',
    'recipePut': env + '/api/recipe/{id}',
}

module.exports = api