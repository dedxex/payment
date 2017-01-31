/* global Stripe */

import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './routes.js';

Bert.defaults.style = 'growl-top-right';
Stripe.setPublishableKey(Meteor.settings.public.stripe);