const { Router } = require('express');
const { body, query, param } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT, validatePermission } = require('../middlewares/validate-jwt');
const { validateStateId } = require('../middlewares/state-express');
const { validateUniqueName } = require('../middlewares/custom-express');

const {
   create,
   findAll,
   findById,
   findByIdAndDelete,
   findByIdAndRestore,
   findByIdAndUpdate
} = require('../controllers/cities');



const router = Router();

// Rutas

// Listar ciudades registrados
router.get('/', [
   validateJWT,
   validatePermission('cities', 'list', true),

   query('limit', 'El límite de documentos debe ser un entero mayor a cero').optional().isInt({gt: 0}),
   query('skip', 'La cantidad de documentos a omitir debe ser un entero mayor a cero').optional().isInt({min: 0}),
   validateFields
], findAll);

// Obtener una ciudad según su id
router.get('/:id', [
   validateJWT,
   validatePermission('cities', 'list', true),

   param('id')
      .not().isEmpty().withMessage('El id es obligatorio').bail()
      .isInt({min: 1}).withMessage('El id es inválido'),

   validateFields
], findById);

// Crear una nueva ciudad
router.post('/', [
   validateJWT,
   validatePermission('cities', 'create', true),

   body('name')
      .not().isEmpty().withMessage('El nombre es obligatorio').bail()
      .isAlpha('es-ES', { ignore: ' '}).withMessage('El nombre debe contener solo letras').bail()
      .custom((name, { req }) => validateUniqueName(name, { modelName: 'City', req })),

   body('stateId')
      .not().isEmpty().withMessage('El id es obligatorio').bail()
      .isInt({min: 1}).withMessage('El id es inválido').bail()
      .custom(validateStateId),

   validateFields
], create);

// Actualizar una ciudad
router.put('/:id', [
   validateJWT,
   validatePermission('cities', 'edit', true),

   param('id')
      .not().isEmpty().withMessage('El id es obligatorio').bail()
      .isInt({min: 1}).withMessage('El id es inválido'),
   
   body('name').optional()
      .isAlpha('es-ES', { ignore: ' '}).withMessage('El nombre debe contener solo letras').bail()
      .custom((name, { req }) => validateUniqueName(name, { modelName: 'City', req, isUpdate: true })),

   body('stateId').optional()
      .isInt({min: 1}).withMessage('El id es inválido').bail()
      .custom(validateStateId),

   validateFields
], findByIdAndUpdate);

// Restaurar ciudad eliminada
router.put('/restore/:id', [
   validateJWT,
   validatePermission('cities', 'delete', true),

   param('id')
      .not().isEmpty().withMessage('El id es obligatorio').bail()
      .isInt({min: 1}).withMessage('El id es inválido'),
   
   validateFields
], findByIdAndRestore);

// Eliminar una ciudad
router.delete('/:id', [
   validateJWT,
   validatePermission('cities', 'delete', true),

   param('id')
      .not().isEmpty().withMessage('El id es obligatorio').bail()
      .isInt({min: 1}).withMessage('El id es inválido'),
   
   validateFields
], findByIdAndDelete);



// Exports
module.exports = {
   name: 'cities',
   router
};