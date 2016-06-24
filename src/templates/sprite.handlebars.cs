namespace PfgFramework.Client.Web.Models {
    public partial class Icon {
        public enum Sprite
        {
            {{#each items}}
            {{name}}{{#unless @last}},{{/unless}} // {{base}}
            {{/each}}
        }
    }
}
