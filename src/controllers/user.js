const { user } = require('../../models');

const joi = require('joi');

exports.getUsers = async (req, res) => {
    try {
        const path = process.env.PATH_KEY;

        let data = await user.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'password']
            }
        });

        const parseJSON = JSON.parse(JSON.stringify(data));

        data = parseJSON.map(item => {
            return {
                ...item,
                image: path + item.image
            }
        });

        res.send({
            status: "success",
            data: {
                users: data
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        })
    }
}

exports.updateUser = async (req, res) => {
    try {
        const id = req.userId;
        const data = req.body;

        const userSelected = await user.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ['updatedAt', 'createdAt', 'password']
            }
        });

        if (!userSelected) {
            return res.send({
                status: "Error",
                message: "User doesn't exist"
            })
        }

        const schema = joi.object({
            email: joi.string().email().min(3),
            name: joi.string().min(3)
        });

        const { error } = schema.validate(data);

        if (error) {
            return res.send({
                status: "Error",
                message: error.details[0].message
            })
        };

        const path = process.env.PATH;
        const image = req.files.imageFile[0].filename;

        const dataUpdate = {
            ...data,
            image,
        }

        await user.update(dataUpdate, {
            where: { id }
        })

        res.send({
            status: "Success",
            message: "Update user data success",
            data: {
                user: {
                    ...dataUpdate,
                    image: path + image
                }
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "server error"
        });
    }
}