(function () {
  'use strict';
  function ContactRouter($stateProvider) {
    $stateProvider.state('main.contact', {
      templateUrl: 'app/contact/contact.html',
      url: '/contact'
    });
  }
  ContactRouter.$inject = ['$stateProvider'];
  angular.module('baram.contact.ContactRouter', []).config(ContactRouter);
}());