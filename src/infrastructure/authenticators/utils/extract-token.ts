export const extractToken = (credentials: string) => { // Basic am9obmRvZUBnbWFpbC5jb206cXdlcnR5
    const [prefix, token] = credentials.split(' ')
    
    const prefixes = ['Basic', 'Bearer']
    if(!prefixes.includes(prefix)) return null

    return token
}