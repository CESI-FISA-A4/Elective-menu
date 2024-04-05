const productProperties = {
  name: { type: 'string' },
  price: { type: 'integer' },
  description: { type: "string" },
  restaurantId: {type: "string"},
  imageUrl: {type: "string"},
  allergenList: {type: "array"},
  ingredientList: {type: "array"}
}

const menuProperties = {
  name: { type: 'string' },
  price: { type: 'integer' },
  description: { type: "string" },
  restaurantId: {type: "string"},
  imageUrl: {type: "string"},
  productIdList: {type: "array"}
}

module.exports = {
  schemaGetAllProduct: {
    schema: {
      description: 'get all products',
    }
  },
  schemaGetAllMenu: {
    schema: {
      description: 'get all menu',
    }
  },
  schemaGetProductById: {
    schema: {
      description: 'get specified product',
      params: {
        type: 'object',
        required: ["productId"],
        properties: {
          id: {
            type: 'string',
            description: 'Product id'
          }
        }
      }
    }
  },
  schemaGetMenuById: {
    schema: {
      description: 'get specified menu',
      params: {
        type: 'object',
        required: ["menuId"],
        properties: {
          id: {
            type: 'string',
            description: 'Menu id'
          }
        }
      }
    }
  },
  schemaGetProductByRestaurantId: {
    schema: {
      description: 'get products of the restaurant',
      params: {
        type: 'object',
        required: ["restaurantId"],
        properties: {
          id: {
            type: 'string',
            description: 'Restaurant id'
          }
        }
      }
    }
  },
  schemaGetMenuByRestaurantId: {
    schema: {
      description: 'get menus of the restaurant',
      params: {
        type: 'object',
        required: ["restaurantId"],
        properties: {
          id: {
            type: 'string',
            description: 'Restaurant id'
          }
        }
      }
    }
  },
  schemaGetProductByName: {
    schema: {
      description: 'get products filtered by name',
      params: {
        type: 'object',
        required: ["productName"],
        properties: {
          id: {
            type: 'string',
            description: 'Product id'
          }
        }
      }
    }
  },
  schemaGetMenuByName: {
    schema: {
      description: 'get menus filtered by name',
      params: {
        type: 'object',
        required: ["menuName"],
        properties: {
          id: {
            type: 'string',
            description: 'Menu id'
          }
        }
      }
    }
  },
  schemaCreateProduct: {
    schema: {
      description: 'create a product',
      body: {
        type: 'object',
        required: ["name","price","description","restaurantId","imageUrl", "allergenList", "ingredientList"],
        properties: productProperties
      }
    }
  },
  schemaCreateMenu: {
    schema: {
      description: 'create a menu',
      body: {
        type: 'object',
        required: ["name","price","description","restaurantId","imageUrl", "productIdList"],
        properties: menuProperties
      }
    }
  },
  schemaDeleteProduct: {
    schema: {
      description: 'delete specified product',
      params: {
        type: 'object',
        required: ["productId"],
        properties: {
          id: {
            type: 'string',
            description: 'Product id'
          }
        }
      }
    }
  },
  schemaDeleteMenu: {
    schema: {
      description: 'delete specified menu',
      params: {
        type: 'object',
        required: ["menuId"],
        properties: {
          id: {
            type: 'string',
            description: 'Menu id'
          }
        }
      }
    }
  },
  schemaUpdateProduct: {
    schema: {
      description: 'update a specified product',
      params: {
        type: 'object',
        required: ["productId"],
        properties: {
          id: {
            type: 'string',
            description: 'Product id'
          }
        }
      },
      body: {
        type: 'object',
        required: ["name","price","description","restaurantId","imageUrl", "allergenList", "ingredientList"],
        properties: productProperties
      }
    }
  },
  schemaUpdateMenu: {
    schema: {
      description: 'Update a specified menu',
      params: {
        type: 'object',
        required: ["menuId"],
        properties: {
          id: {
            type: 'string',
            description: 'Menu id'
          }
        }
      },
      body: {
        type: 'object',
        required: ["name","price","description","restaurantId","imageUrl", "productIdList"],
        properties: menuProperties
      }
    }
  },
  schemaUpdateProductList: {
    schema: {
      description: 'Update the product list of the specified menu',
      params: {
        type: 'object',
        required: ["menuId"],
        properties: {
          id: {
            type: 'string',
            description: 'Menu id'
          }
        }
      },
      body: {
        type: 'object',
        required: ["productIdList"],
        properties: {productIdList: {type: 'array'}}
      }
    }
  }
}