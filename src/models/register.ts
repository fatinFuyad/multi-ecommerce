import "./Store";
import "./Category";
import "./Product";
import "./User";
import "./Subcategory";

////////////
// Prevent schema wasn't registered error for Model
/*
// Solution 1: Import the referenced model 
// If Product references Category, simply import Category before querying: 
// Even if Category isn't directly used, the import registers the model.

    import "@/models/Category";
    import Product from "@/models/Product";

    await Product.find().populate("category"); 
*/

/**
 * Solution 2: Auto-register models after connecting
 * If you have a dbConnect() helper, you can do:

export async function dbConnect() {
  await mongoose.connect(process.env.MONGODB_URI!);

  // Register all models
  await import("@/models/register");
}

* Now every route that calls dbConnect() automatically has all models registered.
* ⚠️ Avoid importing models into each other
 */
