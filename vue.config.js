module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                'assets' : '@/assets',
                'components': '@/components',
                'plugins':'@/plugins',
                'router':'@/router',
                'store':'@/store',
                'views:':'@/views',
                'network':'@/network',
            }
        }
    },
}