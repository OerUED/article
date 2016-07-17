exports.callback = function(req, res, err, data) {
    if (err) {
        res.send({
            status: 500,
            error: err,
            data: null
        });
    } else {
        res.send({
            status: 1,
            error: null,
            data: data
        });
    }
}

exports.promiseAct = function(resolve, reject, err, data) {
    if (err) {
        reject(err);
    } else {
        resolve(data)
    }
}