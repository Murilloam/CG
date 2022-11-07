const TRS = function() {
    this.translation = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
  };
  
  TRS.prototype.getMatrix = function(dst) {
    dst = dst || new Float32Array(16);
    var t = this.translation;
    var r = this.rotation;
    var s = this.scale;
  
    // compute a matrix from translation, rotation, and scale
    m4.translation(t[0], t[1], t[2], dst);
    m4.xRotate(dst, r[0], dst);
    m4.yRotate(dst, r[1], dst);
    m4.zRotate(dst, r[2], dst);
    m4.scale(dst, s[0], s[1], s[2], dst);
    return dst;
  };
  
  const Node = function(source) {
    this.children = [];
    this.localMatrix = m4.identity();
    this.worldMatrix = m4.identity();
    this.source = source;
  };
  
  Node.prototype.setParent = function(parent) {
    // remove us from our parent
    if (this.parent) {
        var ndx = this.parent.children.indexOf(this);
        if (ndx >= 0) {
            this.parent.children.splice(ndx, 1);
        }
    }
  
    // Add us to our new parent
    if (parent) {
        parent.children.push(this);
    }
    this.parent = parent;
  };
  
  Node.prototype.updateWorldMatrix = function(matrix) {
    var source = this.source;
    if (source) {
        source.getMatrix(this.localMatrix);
    }
  
    if (matrix) {
        // a matrix was passed in so do the math
        m4.multiply(matrix, this.localMatrix, this.worldMatrix);
    } else {
        // no matrix was passed in so just copy.
        m4.copy(this.localMatrix, this.worldMatrix);
    }
  
    // now process all the children
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child) {
    child.updateWorldMatrix(worldMatrix);
    });
  }