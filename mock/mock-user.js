const mock = (ctx, next) => {
    ctx.body = {
        name: '石晓波',
        user: 'admin'
    }
    next;
}
exports.default = mock;