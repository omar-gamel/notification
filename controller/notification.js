const Notification = require('../models/notification');
const dsClient = require('../deepstream');

exports.create = async (req, res, next) => {
    try {
        const notification = await new Notification({
            sender: req.user._id,
            receiver: req.body.receiver,
            message: req.body.message,
        }).save();

        res.status(200).send( notification );
        dsClient.event.emit(`notification`, notification );
    } catch (error) {
        next(error);
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const notifications = await Notification.find().populate('sender receiver');

        const count = await Notification.count();
        res.status(201).send({ notifications, count });
    } catch (error) {
        next(error);
    }
};


exports.makeAllSeen = async (req, res, next) => {
    try {
        await Notification.update( { $set: { seen: true } } , { new: true });
        res.send(204);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.seenById = async (req, res, next) => {
    try {
        await Notification.findByIdAndUpdate({ _id: req.params.notificationId }, { seen: true }, { new: true });
        res.send(204);        
    } catch (error) {
       next(error);
    }
};

exports.deleteAll = async (req, res, next) => {
    try {
        const result = await Notification.remove();

        res.status(204).json({ message: 'All Notifiction Deleted', notifications: result });
    } catch (error) {
        next(error);
    }
};

exports.deleteById = async (req, res, next) => {
    try {
        await Notification.findByIdAndRemove(req.params.notificationId);
        res.status(204).json();
        const notifications = await Notification.find();
        dsClient.event.emit(`notification`, notifications );
    } catch (error) {
        next(error);
    }
};







