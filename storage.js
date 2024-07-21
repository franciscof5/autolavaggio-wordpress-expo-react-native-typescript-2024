import { registerInDevtools, Store } from "pullstate";

export const LavaggioStore = new Store({
  //received from API
  progress:0,
  token: "",
  user_object: {
    "id": null,
    "username": "",
    "name": "",
    "first_name": "",
    "last_name": "",
    "email": "",
    "url": "",
    "description": "",
    "link": "",
    "locale": "",
    "nickname": "",
    "slug": "",
    "roles": [],
    "registered_date": "",
    "capabilities": {},
    "extra_capabilities": {},
    "avatar_urls": {
      "24": "",
      "48": "",
      "96": ""
    },
    "meta": {
      "persisted_preferences": []
    },
    "_links": {
      "self": [
        {
          "href": ""
        }
      ],
      "collection": [
        {
          "href": ""
        }
      ]
    }
  },
  car_object: {
    "ID":null,
    "post_author":null,
    "post_date":"",
    "post_date_gmt":"",
    "post_content":"",
    "post_title":"",
    "post_excerpt":"",
    "post_status":"",
    "comment_status":"",
    "ping_status":"",
    "post_password":"",
    "post_name":"Macchina Name",
    "to_ping":"",
    "pinged":"",
    "post_modified":"",
    "post_modified_gmt":"",
    "post_content_filtered":"",
    "post_parent":0,
    "guid":"",
    "menu_order":0,
    "post_type":"",
    "post_mime_type":"",
    "comment_count":"",
    "filter":"",
    "title": {
      "rendered": "loading... ..."
    }
  },
  fleet: [
    {
    "ID":null,
    "post_author":null,
    "post_date":"",
    "post_date_gmt":"",
    "post_content":"",
    "post_title":"",
    "post_excerpt":"",
    "post_status":"",
    "comment_status":"",
    "ping_status":"",
    "post_password":"",
    "post_name":"Macchina Name",
    "to_ping":"",
    "pinged":"",
    "post_modified":"",
    "post_modified_gmt":"",
    "post_content_filtered":"",
    "post_parent":0,
    "guid":"",
    "menu_order":0,
    "post_type":"",
    "post_mime_type":"",
    "comment_count":"",
    "filter":"",
    "title": {
      "rendered": "loading... ..."
    }
  }, 
  {
    "ID":null,
    "post_author":null,
    "post_date":"",
    "post_date_gmt":"",
    "post_content":"",
    "post_title":"",
    "post_excerpt":"",
    "post_status":"",
    "comment_status":"",
    "ping_status":"",
    "post_password":"",
    "post_name":"Macchina Name",
    "to_ping":"",
    "pinged":"",
    "post_modified":"",
    "post_modified_gmt":"",
    "post_content_filtered":"",
    "post_parent":0,
    "guid":"",
    "menu_order":0,
    "post_type":"",
    "post_mime_type":"",
    "comment_count":"",
    "filter":"",
    "title": {
      "rendered": "loading... ..."
    }
  }],
  car_ids: [12,44,54],
  //
  partners_ids: [13,409],
  //controlled from app
  session_object: {
  
  },
});

registerInDevtools({
  LavaggioStore,
});