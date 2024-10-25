import expressApp from './app'

const PORT = process.env.PORT || 8000

const startServer = async () => {
    expressApp.listen(PORT, () => {
        console.log(`✅ Server is running on port ${PORT}`)
    })

    process.on('unhandledRejection', (err) => {
        console.log(`❌ ${err}`);
        process.exit(1)
    })
}

startServer().then(() => console.log('Server started'))