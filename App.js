var app = null;
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items:{
        html:'<a href="https://help.rallydev.com/apps/2.0rc1/doc/#!/api/Rally.data.WsapiDataStore">Hint!<a>'
    },

    launch: function() {
        var me = this;
        var app = this;
        var store = Ext.create('Rally.data.WsapiDataStore', {
            model: 'Tags',
            context: {
                project: '/project/28680448599',
                projectScopeUp: false,
                projectScopeDown: false
            },
            filters: [{
                property: "Name",
                operator: "=",
                value: "REQTYPE_Functional"
            }],
            autoLoad: true,
            fetch: ['Name', 'ObjectID']
        });
        store.on("load",app.getSnapshots);
    },

    getSnapshots:function(store,records){
        scope = this;
        var storyOids = []
        console.log("Story oids: ", storyOids);        
        storyOids = _.map(records, function(record, storyOids) {
           return record.data.ObjectID  ;
        });
        console.log("Story oids: ", storyOids);        
        var snapshotStore = Ext.create('Rally.data.lookback.SnapshotStore', {
            context: {
                workspace: '/workspace/28493944267',
                project: '/project/28680448599',
                projectScopeUp: false,
                projectScopeDown: false
            },
            filters: 
            [{
                property: "_TypeHierarchy",
                operator: "=",
                value: "HierarchicalRequirement"
            },
            {
                property: "tags",
                operator: "$eq",
                value: "REQTYPE_Functional",
            }],
            fetch: ["ScheduleState", "PlanEstimate", "ObjectID"]
        });
        snapshotStore.load({
            callback: function(snaps, operation) {
                if(operation.wasSuccessful()) {
                    _.each(snaps, function(snap){
                        console.log("snap: ", snap);
                    })
                }
            }
        });

    },


});