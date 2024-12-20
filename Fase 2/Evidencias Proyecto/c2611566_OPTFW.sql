-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 09-12-2024 a las 22:45:29
-- Versión del servidor: 8.0.35
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `c2611566_OPTFW`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_01_LOGIN` (IN `p_USUARIO` VARCHAR(100), IN `p_CONTRASENIA` VARCHAR(20))   BEGIN
    SELECT  T1.ID_USUARIO,
    		T1.EMAIL,
            T1.NOMBRE_USUARIO,
            T2.ROL,
            T1.NOMBRE,
            T1.APATERNO
    FROM usuarios T1
    JOIN usuario_empresa T2 ON T1.ID_USUARIO = T2.ID_USUARIO
    WHERE UPPER(T1.EMAIL) = UPPER(p_USUARIO) 
      AND T1.CONTRASENIA = p_CONTRASENIA 
      AND T1.ESTADO = 1;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_02_LLENADO_PERFIL` (IN `p_IDUSER` INT)   BEGIN
    -- -------------------------------------- LLENAR DATOS PERFIL USUARIO ------------------------------
            SELECT 
                T1.NOMBRE_USUARIO,
                T1.EMAIL,
                T1.NOMBRE,
                T1.APATERNO,
                T1.AMATERNO,
                T1.TELEFONO,
                T3.ROL
                -- T2.DESCRIPCION_ESTADO
            FROM usuarios T1
            JOIN estado T2 ON T1.ESTADO = T2.ID_ESTADO
            JOIN usuario_empresa T3 ON T1.ID_USUARIO = T3.ID_USUARIO
            WHERE T1.ID_USUARIO = p_IDUSER;


END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_03_TABLA_GESTION_USUARIOS` (IN `P_IDUSUARIO` INT)   BEGIN
    SELECT
        T1.ID_USUARIO,
        T1.NOMBRE_USUARIO,
        T1.EMAIL,
        T1.ESTADO
    FROM usuarios T1
    JOIN usuario_empresa T2 ON T1.ID_USUARIO = T2.ID_USUARIO
    WHERE T2.ROL = 2 
      AND T2.ID_EMPRESA = (SELECT ID_EMPRESA FROM usuario_empresa WHERE ID_USUARIO = P_IDUSUARIO LIMIT 1);
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_04_LISTA_ESTADOS` ()   BEGIN
	SELECT ID_ESTADO, DESCRIPCION_ESTADO FROM estado;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_05_ACTUALIZAR_USUARIO_DATOS` (IN `p_ID_USUARIO` INT, IN `p_NOMBRE_USUARIO` VARCHAR(100), IN `p_EMAIL` VARCHAR(100), IN `p_NOMBRE` VARCHAR(100), IN `p_APATERNO` VARCHAR(100), IN `p_AMATERNO` VARCHAR(100), IN `p_TELEFONO` VARCHAR(20))   BEGIN
    
    UPDATE usuarios
    SET 
        NOMBRE_USUARIO = p_NOMBRE_USUARIO,
        EMAIL = p_EMAIL,
        NOMBRE = p_NOMBRE,
        APATERNO = p_APATERNO,
        AMATERNO = p_AMATERNO,
        TELEFONO = p_TELEFONO
    WHERE ID_USUARIO = p_ID_USUARIO;
    
    
    IF ROW_COUNT() = 0 THEN
        -- Si no se ha actualizado ninguna fila, devolver un mensaje de error
        SELECT 0 AS VALIDACION;
    ELSE
        -- Si se ha actualizado correctamente, devolver un mensaje de éxito
        SELECT 1 AS VALIDACION;
    END IF;
    
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_06_ACTUALIZAR_ESTADO_USUARIO` (IN `p_ID_USUARIO` INT, IN `p_IDESTADO` INT)   BEGIN
    -- Actualizar el estado del usuario
    UPDATE usuarios
    SET ESTADO = p_IDESTADO 
    WHERE ID_USUARIO = p_ID_USUARIO;
    
    IF ROW_COUNT() = 0 THEN
        -- Si no se ha actualizado ninguna fila, devolver un mensaje de error
        SELECT 0 AS VALIDACION;
    ELSE
        -- Si se ha actualizado correctamente, devolver un mensaje de éxito
        SELECT 1 AS VALIDACION;
    END IF;
    
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_07_NUEVO_USUARIO` (IN `p_NOMBRE_USUARIO` VARCHAR(50), IN `p_EMAIL` VARCHAR(100), IN `p_CONTRASENIA` VARCHAR(255), IN `p_NOMBRE` VARCHAR(50), IN `p_APATERNO` VARCHAR(50), IN `p_AMATERNO` VARCHAR(50), IN `p_TELEFONO` VARCHAR(15), IN `p_IDESTADO` INT, IN `p_IDEMPRESA` INT, IN `P_IDROL` INT)  NO SQL BEGIN
    -- Insertar en la tabla USUARIOS
    INSERT INTO usuarios (
        NOMBRE_USUARIO,
        EMAIL, 
        CONTRASENIA,
        NOMBRE,
        APATERNO,
        AMATERNO,
        TELEFONO,
        ESTADO
    )
    VALUES (
        p_NOMBRE_USUARIO,
        p_EMAIL,
        p_CONTRASENIA,
        p_NOMBRE,
        p_APATERNO,
        p_AMATERNO,
        p_TELEFONO,
        p_IDESTADO
    );

    -- Insertar en la tabla USUARIO_EMPRESA
    INSERT INTO usuario_empresa (ID_USUARIO, ID_EMPRESA, ROL)
    VALUES (
        (SELECT ID_USUARIO FROM usuarios WHERE NOMBRE_USUARIO = p_NOMBRE_USUARIO),
        p_IDEMPRESA,
        p_IDROL
    );

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_08_LISTA_ROL` ()  NO SQL BEGIN
	SELECT ID_ROL, DESCRIPCION_ROL FROM rol;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_09_LISTA_EMPRESA` ()  NO SQL BEGIN
	SELECT ID_EMPRESA, NOMBRE_EMPRESA FROM empresas WHERE ESTADO = 1;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_10_LLENADO_MOVIMIENTOS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
	SELECT T1.ID_MOVIMIENTO,
       T2.DESCRIPCION_MOVIMIENTO,
       T3.NOMBRE AS RESPONSABLE,
       T1.FECHA_MOVIMIENTO,
       T1.NOTA,
       (SUM(T4.PRECIO * T4.CANTIDAD)) AS TOTAL_MOVIMIENTO,
       T5.DESCRIPCION,
       T6.DESCRIPCION_PAGO
FROM movimientos T1
JOIN tipo_movimiento T2 ON T1.TIPO_MOVIMIENTO = T2.ID_TIPO_MOVIMIENTO
JOIN usuarios T3 ON T3.ID_USUARIO = T1.ID_USUARIO
JOIN detalle_movimiento T4 ON T4.ID_MOVIMIENTO = T1.ID_MOVIMIENTO
JOIN categorias_movimientos T5 ON T5.ID_CATEGORIA = T1.ID_CATEGORIA
JOIN tipo_pago T6 ON T6.ID_TIPO_PAGO = T1.ID_TIPO_PAGO
JOIN usuario_empresa T7 ON T7.ID_USUARIO = T3.ID_USUARIO
JOIN empresas T8 ON T8.ID_EMPRESA = T7.ID_EMPRESA
WHERE T7.ID_EMPRESA = (SELECT ID_EMPRESA FROM usuario_empresa WHERE ID_USUARIO = P_IDUSUARIO)
GROUP BY T1.ID_MOVIMIENTO,
         T2.DESCRIPCION_MOVIMIENTO,
         T3.NOMBRE,
         T1.FECHA_MOVIMIENTO,
         T1.NOTA,
         T5.DESCRIPCION,
         T6.DESCRIPCION_PAGO
ORDER BY T1.ID_MOVIMIENTO DESC;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_11_LLENADO_DETALLE_MOVIMIENTO` (IN `P_IDMOVIMIENTO` INT)  NO SQL BEGIN
	SELECT 
    T1.ID_MOVIMIENTO,
    T1.ITEM, 
    T1.ID_LOTE, 
    T1.CANTIDAD, 
    T1.PRECIO,
    T2.DESCRIPCION_PRODUCTO,
    SUM(T1.CANTIDAD * T1.PRECIO) AS TOTAL
FROM detalle_movimiento T1
JOIN productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
WHERE T1.ID_MOVIMIENTO = P_IDMOVIMIENTO
GROUP BY 
    T1.ID_MOVIMIENTO,
    T1.ITEM, 
    T1.ID_LOTE, 
    T1.CANTIDAD, 
    T1.PRECIO,
    T2.DESCRIPCION_PRODUCTO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_12_LLENADO_TABLA_PRODUCTOS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN

SELECT
	T1.ID_PRODUCTO,
    T1.NOMBRE_PRODUCTO,
    T1.DESCRIPCION_PRODUCTO,
    T4.DESCRIPCION_UNIDAD AS UNIDAD_MEDIDA, 
    (
        SELECT SUM(T4.CANTIDAD) 
        FROM lotes_productos T4 
        WHERE T4.ID_PRODUCTO = T1.ID_PRODUCTO 
          AND T4.FECHA_VENCIMIENTO > NOW()
    ) AS TOTAL_CANTIDAD,
    T2.PRECIO_VENTA,
    (
        SELECT MAX(T5.FECHA_COMPRA)
        FROM lotes_productos T5
        WHERE T5.ID_PRODUCTO = T1.ID_PRODUCTO
          AND T5.FECHA_VENCIMIENTO > NOW()
    ) AS FECHA_COMPRA, -- Seleccionamos la fecha de compra máxima
    T3.NOMBRE_PROVEEDOR,
    T1.ID_ESTADO
FROM productos T1
JOIN unidad_medida T4 ON T1.UNIDAD_MEDIDA = T4.ID_UNIDAD_MEDIDA
JOIN lotes_productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN proveedores T3 ON T1.ID_PROVEEDOR = T3.ID_PROVEEDOR
JOIN usuario_empresa UE ON T1.ID_EMPRESA = UE.ID_EMPRESA -- Relacionamos la empresa del producto con la del usuario
WHERE T2.FECHA_VENCIMIENTO > NOW() 
  -- AND T2.CANTIDAD > 0 
  AND T2.PRECIO_VENTA = (
      SELECT MAX(PRECIO_VENTA) 
      FROM lotes_productos 
      WHERE FECHA_VENCIMIENTO > NOW() 
        AND CANTIDAD > 0
        AND ID_PRODUCTO = T2.ID_PRODUCTO
  )
  AND UE.ID_USUARIO =  P_IDUSUARIO -- Filtramos por el ID del usuario que se pasa como parámetro
  /*AND T1.ID_PROVEEDOR IN (
      SELECT T1.ID_PROVEEDOR
      FROM proveedores T1 
      JOIN productos T2 ON T1.ID_PROVEEDOR = T2.ID_PROVEEDOR
      JOIN lotes_productos T3 ON T2.ID_PRODUCTO = T3.ID_PRODUCTO
      WHERE T3.FECHA_COMPRA = (
          SELECT MAX(FECHA_COMPRA) 
          FROM lotes_productos
      )
  )*/
  AND T3.ID_ESTADO = 1
--  AND T1.ID_ESTADO = 1
  
GROUP BY 
	T1.ID_PRODUCTO,
    T1.NOMBRE_PRODUCTO,
    T1.DESCRIPCION_PRODUCTO,
    T4.DESCRIPCION_UNIDAD,
    T2.PRECIO_VENTA,
    T3.NOMBRE_PROVEEDOR,
    T1.ID_ESTADO
ORDER BY T1.ID_PRODUCTO;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_13_NUEVO_PRODUCTO` (IN `P_NOMBRE_PRODUCTO` VARCHAR(100), IN `P_DESCRIPCION_PROD1` TEXT, IN `P_UNIDAD_MEDIDA` INT, IN `P_ID_PROVEEDOR` INT, IN `P_ID_USUARIO` INT, IN `P_ID_LOTE` INT, IN `P_FECHA_VENCIMIENTO` DATE, IN `P_CANTIDAD` INT, IN `P_PRECIO_COMPRA` INT, IN `P_PRECIO_VENTA` INT, IN `P_FECHA_COMPRA` DATE)  NO SQL BEGIN
    DECLARE v_ID_EMPRESA INT;
    DECLARE v_ID_PRODUCTO INT;

    -- Obtener el ID_EMPRESA del usuario
    SELECT ID_EMPRESA 
    INTO v_ID_EMPRESA
    FROM usuario_empresa
    WHERE ID_USUARIO = P_ID_USUARIO
    LIMIT 1;

    -- Insertar el nuevo producto
    INSERT INTO productos (NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO, UNIDAD_MEDIDA, ID_PROVEEDOR, ID_EMPRESA, ID_ESTADO)
    VALUES (P_NOMBRE_PRODUCTO, P_DESCRIPCION_PROD1, P_UNIDAD_MEDIDA, P_ID_PROVEEDOR, v_ID_EMPRESA, 1);

    -- Obtener el ID_PRODUCTO con el máximo valor tras la inserción
    SELECT MAX(ID_PRODUCTO)
    INTO v_ID_PRODUCTO
    FROM productos;

    -- Insertar el lote del producto
    INSERT INTO lotes_productos (ID_LOTE, ID_PRODUCTO, FECHA_VENCIMIENTO, CANTIDAD, PRECIO_COMPRA, PRECIO_VENTA, FECHA_COMPRA)
    VALUES (P_ID_LOTE, v_ID_PRODUCTO, P_FECHA_VENCIMIENTO, P_CANTIDAD, P_PRECIO_COMPRA, P_PRECIO_VENTA, P_FECHA_COMPRA);

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_14_SELECT_PRODUCTOS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
    SELECT
    T1.ID_PRODUCTO,
    T1.NOMBRE_PRODUCTO,
    T1.DESCRIPCION_PRODUCTO
FROM productos T1
WHERE T1.ID_EMPRESA = (
    SELECT ID_EMPRESA 
    FROM usuario_empresa 
    WHERE ID_USUARIO = P_IDUSUARIO
    AND ID_ESTADO = 1
) AND T1.ID_ESTADO = 1;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_15_SELECT_UNIDAD_MEDIDA` ()  NO SQL BEGIN
	SELECT ID_UNIDAD_MEDIDA,
    DESCRIPCION_UNIDAD
    FROM unidad_medida;  
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_16_SELECT_PROVEEDORES` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT DISTINCT
    T1.ID_PROVEEDOR,
    T1.NOMBRE_PROVEEDOR
FROM proveedores T1
/*JOIN productos T2 ON T1.ID_PROVEEDOR = T2.ID_PROVEEDOR
WHERE T2.ID_EMPRESA = (
    SELECT T1.ID_EMPRESA 
    FROM usuario_empresa T1
    JOIN empresas T2 ON T1.ID_EMPRESA = T2.ID_EMPRESA
    WHERE ID_USUARIO = P_IDUSUARIO
    AND T2.ESTADO = 1
)*/
JOIN usuario_empresa T2 ON T1.ID_EMPRESA = T2.ID_EMPRESA
WHERE T2.ID_USUARIO = P_IDUSUARIO
;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_17_NUEVO_LOTE` (IN `P_NROLOTE` INT, IN `P_IDPRODUCTO` INT, IN `P_IDUSUARIO` INT, IN `P_FECHA_VENCIMIENTO` DATE, IN `P_CANTIDAD` INT, IN `P_PRECIO_COMPRA` INT, IN `P_PRECIO_VENTA` INT, IN `P_FECHA_COMPRA` DATE)  NO SQL BEGIN

DECLARE P_EXISTE INT;

SELECT COALESCE(COUNT(*), 0)
    INTO P_EXISTE
    FROM lotes_productos T1
    JOIN productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
    WHERE T1.ID_LOTE = P_NROLOTE
    AND T2.ID_PRODUCTO = P_IDPRODUCTO
    AND T2.ID_EMPRESA = (select id_empresa from usuario_empresa where id_usuario = P_IDUSUARIO)
    AND T2.ID_ESTADO = 1;


IF P_EXISTE = 0 THEN

        INSERT INTO lotes_productos (ID_LOTE, 
                                     ID_PRODUCTO,
                                     FECHA_VENCIMIENTO,
                                     CANTIDAD,
                                     PRECIO_COMPRA,
                                     PRECIO_VENTA,
                                     FECHA_COMPRA)
        VALUES 
        (P_NROLOTE,
         P_IDPRODUCTO,
         P_FECHA_VENCIMIENTO,
         P_CANTIDAD,
         P_PRECIO_COMPRA,
         P_PRECIO_VENTA,
         P_FECHA_COMPRA);
        

        SELECT 2 AS VALIDACION;

    ELSE

        SELECT 1 AS VALIDACION;
    END IF;
    END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_18_ACTUALIZA_ESTADO_PRODUCTO` (IN `P_IDUSUARIO` INT, IN `P_IDPRODUCTO` INT, IN `P_IDESTADO` INT)  NO SQL BEGIN
	UPDATE productos SET ID_ESTADO = P_IDESTADO WHERE ID_PRODUCTO = P_IDPRODUCTO
    AND ID_EMPRESA = (SELECT ID_EMPRESA FROM usuario_empresa WHERE ID_USUARIO = P_IDUSUARIO);
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_19_SELECT_CATEGORIA_MOVIMIENTO` ()  NO SQL BEGIN
	SELECT ID_CATEGORIA,DESCRIPCION FROM categorias_movimientos;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_20_STOCK_PRODUCTOS` (IN `P_IDPRODUCTO` INT, IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT MAX(T1.PRECIO_VENTA), SUM(T1.CANTIDAD)
FROM lotes_productos T1
JOIN productos T4 ON T4.ID_PRODUCTO = T1.ID_PRODUCTO
JOIN usuario_empresa T3 ON T3.ID_EMPRESA = T4.ID_EMPRESA
JOIN empresas T2 ON T2.ID_EMPRESA = T3.ID_EMPRESA
WHERE T1.fecha_compra = (SELECT MAX(T1.fecha_compra) 
                         FROM lotes_productos T1 
                         WHERE T1.ID_PRODUCTO = T4.ID_PRODUCTO)
AND T1.ID_PRODUCTO = 5 
AND T3.ID_USUARIO = 6;
    
    
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_21_SELECT_RESPONSABLES` (IN `P_IDUSUARIO` INT)   BEGIN
    SELECT 
    U.ID_USUARIO,
	U.NOMBRE
    FROM usuarios U
    JOIN usuario_empresa UE ON U.ID_USUARIO = UE.ID_USUARIO
    WHERE UE.ID_EMPRESA = (
        SELECT ID_EMPRESA 
        FROM usuario_empresa 
        WHERE ID_USUARIO = P_IDUSUARIO
    );
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_22_SELECT_CATGASTOOPERACIONAL` ()   BEGIN
    SELECT DESCRIPCION_CATEGORIA FROM categorias_gasto_operativo;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_23_NUEVO_GASTO_OPERACIONAL` (IN `P_DESCRIPCION` VARCHAR(100), IN `P_MONTO` INT, IN `P_CATEGORIA` VARCHAR(50), IN `P_IDUSUARIO` INT)  NO SQL BEGIN
    DECLARE P_IDCATEGORIA INT;
    DECLARE P_IDEMPRESA INT;

    -- Asignar el valor de la categoría a la variable P_IDCATEGORIA
    SET P_IDCATEGORIA = (SELECT ID_CATEGORIA FROM categorias_gasto_operativo WHERE DESCRIPCION_CATEGORIA = P_CATEGORIA LIMIT 1);

    -- Asignar el valor de la empresa a la variable P_IDEMPRESA
    SET P_IDEMPRESA = (SELECT ID_EMPRESA FROM usuario_empresa WHERE ID_USUARIO = P_IDUSUARIO LIMIT 1);

    -- Insertar el registro en la tabla GASTOS_OPERATIVOS
    INSERT INTO gastos_operativos (DESCRIPCION_GASTO, MONTO_GASTO, ID_EMPRESA, ID_CATEGORIA_GASTO_OPERATIVO, FECHA_GASTO)
    VALUES (P_DESCRIPCION, P_MONTO, P_IDEMPRESA, P_IDCATEGORIA, CURDATE());

    -- Devolver una validación
    SELECT 1 AS VALIDACION;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_24_CANTIDAD_TOTAL_PRODUCTO` (IN `P_IDPRODUCTO` INT, IN `P_IDUSUARIO` INT)   BEGIN
    -- Consulta para obtener la cantidad total y el precio del lote más reciente
    SELECT 
        COALESCE(SUM(T1.CANTIDAD), 0) AS CANTIDAD, 
        T3.PRECIO_VENTA 
    FROM lotes_productos T1
    JOIN productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO 
    LEFT JOIN (
        SELECT ID_PRODUCTO, PRECIO_VENTA, FECHA_COMPRA 
        FROM lotes_productos 
        WHERE (ID_PRODUCTO, FECHA_COMPRA) IN (
            SELECT ID_PRODUCTO, MAX(FECHA_COMPRA) 
            FROM lotes_productos 
            GROUP BY ID_PRODUCTO
        )
    ) T3 ON T1.ID_PRODUCTO = T3.ID_PRODUCTO
    WHERE T2.ID_PRODUCTO = P_IDPRODUCTO
    AND T2.ID_EMPRESA = (
        SELECT ID_EMPRESA 
        FROM usuario_empresa 
        WHERE ID_USUARIO = P_IDUSUARIO
    )
    GROUP BY T1.ID_PRODUCTO, T3.precio_venta;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_25_EDITAR_PRODUCTO` (IN `P_ID_PRODUCTO` INT, IN `P_NOMBRE_PRODUCTO` VARCHAR(100), IN `P_DESCRIPCION_PROD1` TEXT, IN `P_UNIDAD_MEDIDA` INT, IN `P_ID_PROVEEDOR` INT, IN `P_ID_USUARIO` INT, IN `P_ID_LOTE` INT, IN `P_FECHA_VENCIMIENTO` DATE, IN `P_CANTIDAD` INT, IN `P_PRECIO_COMPRA` INT, IN `P_PRECIO_VENTA` INT, IN `P_FECHA_COMPRA` DATE)  NO SQL BEGIN

    -- Actualizar los detalles del producto
    UPDATE productos 
    SET 
        NOMBRE_PRODUCTO = P_NOMBRE_PRODUCTO, 
        DESCRIPCION_PRODUCTO = P_DESCRIPCION_PROD1, 
        UNIDAD_MEDIDA = P_UNIDAD_MEDIDA, 
        ID_PROVEEDOR = P_ID_PROVEEDOR
    WHERE 
        ID_PRODUCTO = P_ID_PRODUCTO;

    -- Actualizar el lote del producto
    UPDATE lotes_productos 
    SET 
        FECHA_VENCIMIENTO = P_FECHA_VENCIMIENTO, 
        CANTIDAD = P_CANTIDAD, 
        PRECIO_COMPRA = P_PRECIO_COMPRA, 
        PRECIO_VENTA = P_PRECIO_VENTA, 
        FECHA_COMPRA = P_FECHA_COMPRA
    WHERE 
        ID_LOTE = P_ID_LOTE 
        AND ID_PRODUCTO = P_ID_PRODUCTO;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_26_SALIDA_MERMA_PRODUCTOS_USUARIO` (IN `p_id_usuario` INT, IN `p_id_producto` INT)   BEGIN
    SELECT 
        lp.ID_LOTE,
        lp.ID_PRODUCTO,
        p.NOMBRE_PRODUCTO,
        lp.FECHA_VENCIMIENTO,
        lp.CANTIDAD
    FROM 
        lotes_productos lp
    INNER JOIN 
        productos p ON lp.ID_PRODUCTO = p.ID_PRODUCTO
    INNER JOIN 
        usuario_empresa ue ON p.ID_EMPRESA = ue.ID_EMPRESA
    INNER JOIN 
        usuarios u ON ue.ID_USUARIO = u.ID_USUARIO
    WHERE 
        u.ID_USUARIO = p_id_usuario
        AND lp.ID_PRODUCTO = p_id_producto
        AND p.ID_ESTADO = 1  
        AND lp.FECHA_VENCIMIENTO >= CURDATE()  
        AND lp.CANTIDAD > 0; 
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_27_OBTENER_RAZONES_MERMA` ()   BEGIN
    SELECT 
        ID_RAZON_MERMA, 
        DESCRIPCION_RAZON
    FROM 
        razon_merma;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_28_INSERTAR_MOVIMIENTO` (IN `P_IDUSUARIO` INT, IN `P_ID_TIPOPAGO` INT, OUT `P_ID_MOVIMIENTO` INT)   BEGIN
    -- Crear un nuevo registro en la tabla movimientos
    INSERT INTO movimientos (TIPO_MOVIMIENTO, ID_USUARIO, FECHA_MOVIMIENTO, NOTA, ID_CATEGORIA, ID_TIPO_PAGO)
    VALUES (2, P_IDUSUARIO, NOW(),'NOTA QUE SE ELIMINARA', 3, P_ID_TIPOPAGO); -- TIPO_MOVIMIENTO 2 -> SALIDA, ID_CATEGORIA 3 -> VENTA

    -- Obtener el ID del movimiento recién creado
    SET P_ID_MOVIMIENTO = LAST_INSERT_ID();
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_29_INSERTAR_DETALLE_MOVIMIENTO` (IN `P_ID_MOVIMIENTO` INT, IN `P_ID_PRODUCTO` INT, IN `P_CANTIDAD_TOTAL` INT, IN `P_PRECIO` INT, IN `P_ID_USUARIO` INT, IN `P_DESCUENTO` INT)   BEGIN
    DECLARE v_id_empresa INT;
    DECLARE v_cantidad_restante INT DEFAULT P_CANTIDAD_TOTAL;
    DECLARE v_cantidad_usada INT;
    DECLARE v_id_lote INT;
    DECLARE v_fecha_vencimiento DATE;
    DECLARE v_cantidad_lote INT;
    DECLARE v_item INT DEFAULT 1;
    DECLARE done INT DEFAULT 0;

    -- Declaración del cursor para los lotes disponibles
    DECLARE lote_cursor CURSOR FOR
        SELECT lp.ID_LOTE, lp.FECHA_VENCIMIENTO, lp.CANTIDAD
        FROM lotes_productos lp
        JOIN productos p ON lp.ID_PRODUCTO = p.ID_PRODUCTO
        WHERE lp.ID_PRODUCTO = p_id_producto
--          AND p.ID_EMPRESA = v_id_empresa -- Filtrar por la empresa del usuario
          AND lp.FECHA_VENCIMIENTO > CURDATE() -- Lotes no vencidos
          AND lp.CANTIDAD > 0 -- Solo considerar lotes con cantidad positiva
        ORDER BY lp.FECHA_VENCIMIENTO ASC;

    -- Declarar el manejador para cuando no haya más registros en el cursor
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Ahora, después de las declaraciones, podemos ejecutar el código

    -- Obtener la empresa del usuario conectado
--    SELECT ID_EMPRESA INTO v_id_empresa
--    FROM usuario_empresa
--    WHERE ID_USUARIO = p_id_usuario;

    -- Validar que el producto pertenece a la empresa del usuario
--    IF NOT EXISTS (
--        SELECT 1
--        FROM productos
--        WHERE ID_PRODUCTO = p_id_producto
--        AND ID_EMPRESA = v_id_empresa
--    ) THEN
--        SIGNAL SQLSTATE '45000'
--        SET MESSAGE_TEXT = 'El producto no pertenece a la empresa del usuario.';
--    END IF;

    -- Abrir el cursor después de las validaciones
    OPEN lote_cursor;

    -- Bucle para procesar los lotes
    read_loop: LOOP
        -- Obtener el siguiente lote del cursor
        FETCH lote_cursor INTO v_id_lote, v_fecha_vencimiento, v_cantidad_lote;

        -- Si no hay más lotes, salir del bucle
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Lógica para procesar la cantidad según los lotes
        IF v_cantidad_lote >= v_cantidad_restante THEN
            SET v_cantidad_usada = v_cantidad_restante;
            -- Actualizar la cantidad del lote
            UPDATE lotes_productos
            SET CANTIDAD = CANTIDAD - v_cantidad_usada
            WHERE ID_LOTE = v_id_lote
              AND ID_PRODUCTO = p_id_producto
              AND EXISTS (
                SELECT 1
                FROM productos
                WHERE ID_PRODUCTO = p_id_producto
--                AND ID_EMPRESA = v_id_empresa
              );

            -- Insertar el detalle del movimiento
            INSERT INTO detalle_movimiento (ID_MOVIMIENTO, ID_LOTE, CANTIDAD, PRECIO, ITEM, ID_PRODUCTO, DESCUENTO)
            VALUES (p_id_movimiento, v_id_lote, v_cantidad_usada, p_precio, v_item, p_id_producto, p_descuento);

            -- Terminar ya que hemos cubierto toda la cantidad
            SET v_cantidad_restante = 0;
            LEAVE read_loop;

        ELSE
            -- Si el lote no tiene suficiente cantidad, usar todo el lote y continuar
            SET v_cantidad_usada = v_cantidad_lote;
            -- Actualizar la cantidad del lote a 0
            UPDATE lotes_productos
            SET CANTIDAD = 0
            WHERE ID_LOTE = v_id_lote
              AND ID_PRODUCTO = p_id_producto
              AND EXISTS (
                SELECT 1
                FROM productos
                WHERE ID_PRODUCTO = p_id_producto
  --              AND ID_EMPRESA = v_id_empresa
              );

            -- Insertar el detalle del movimiento con lo usado del lote actual
            INSERT INTO detalle_movimiento (ID_MOVIMIENTO, ID_LOTE, CANTIDAD, PRECIO, ITEM, ID_PRODUCTO, DESCUENTO)
            VALUES (p_id_movimiento, v_id_lote, v_cantidad_usada, p_precio, v_item, p_id_producto, p_descuento);

            -- Reducir la cantidad restante y continuar con el siguiente lote
            SET v_cantidad_restante = v_cantidad_restante - v_cantidad_usada;

            -- Incrementar el ítem
            SET v_item = v_item + 1;
        END IF;
    END LOOP;

    -- Cerrar el cursor después de completar el procesamiento
    CLOSE lote_cursor;

    -- Si después de procesar todos los lotes aún queda cantidad por descontar, lanzar error
    IF v_cantidad_restante > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay suficiente inventario disponible para cubrir la salida.';
    END IF;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_30_OBTENER_PRECIO_COMPRA_LOTE` (IN `P_ID_LOTE` INT)   BEGIN
    -- Verificamos que el lote exista y obtenemos el precio de compra
    SELECT 
        PRECIO_COMPRA 
    FROM 
        lotes_productos
    WHERE 
        ID_LOTE = P_ID_LOTE;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_31_OBTENER_COSTO_MERMA` (IN `P_ID_LOTE` INT, IN `P_ID_PRODUCTO` INT)   BEGIN
    SELECT 
        PRECIO_COMPRA 
    FROM 
        lotes_productos
    WHERE 
        ID_LOTE = P_ID_LOTE
        AND ID_PRODUCTO = P_ID_PRODUCTO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_32_GUARDAR_MERMA` (IN `P_ID_LOTE` INT, IN `P_ID_PRODUCTO` INT, IN `P_CANTIDAD` INT, IN `P_RAZON` INT, IN `P_DESCRIPCION` VARCHAR(255), IN `P_COSTO_MERMA` INT)   BEGIN
    DECLARE P_CANT_DISPONIBLE INT DEFAULT 0;
    DECLARE P_NUEVA_CANTIDAD INT DEFAULT 0;

    -- Inserta el registro en la tabla productos_merma
    INSERT INTO productos_merma (ID_PRODUCTO, ID_LOTE, CANTIDAD, RAZON_MERMA, DESCRIPCION, COSTO_MERMA, FECHA_REGISTRO)
    VALUES (P_ID_PRODUCTO, P_ID_LOTE, P_CANTIDAD, P_RAZON, P_DESCRIPCION, P_COSTO_MERMA, NOW());

    -- Selecciona la cantidad disponible en lotes_productos
    SELECT CANTIDAD INTO P_CANT_DISPONIBLE
    FROM lotes_productos
    WHERE ID_LOTE = P_ID_LOTE AND ID_PRODUCTO = P_ID_PRODUCTO;

    -- Calcula la nueva cantidad
    SET P_NUEVA_CANTIDAD = P_CANT_DISPONIBLE - P_CANTIDAD;

    -- Actualiza la cantidad en la tabla lotes_productos
    UPDATE lotes_productos
    SET CANTIDAD = P_NUEVA_CANTIDAD
    WHERE ID_PRODUCTO = P_ID_PRODUCTO AND ID_LOTE = P_ID_LOTE;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_33_LLENADO_TABLA_PROVEEDORES` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
DISTINCT
	T1.ID_PROVEEDOR,
    T1.NOMBRE_PROVEEDOR,
    T1.NOMBRE_CONTACTO,
    T1.TELEFONO_CONTACTO,
    T1.EMAIL_CONTACTO,
    T2.CALLE,
    T2.NUMERO,
    T3.NOMBRE_CIUDAD,
    T1.ID_ESTADO
    FROM proveedores T1
    JOIN direcciones T2 ON T1.ID_DIRECCION = T2.ID_DIRECCION
    JOIN ciudad T3 ON T2.ID_CIUDAD = T3.ID_CIUDAD
    JOIN usuario_empresa T6 ON T6.ID_EMPRESA = T1.ID_EMPRESA
    WHERE T6.ID_USUARIO = P_IDUSUARIO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_34_LLENAR_MODAL_EDITAR_PRODUCTO` (IN `P_IDPRODUCTO` INT)  NO SQL BEGIN
SELECT 
T1.NOMBRE_PRODUCTO,
T1.DESCRIPCION_PRODUCTO,
T1.UNIDAD_MEDIDA,
T1.ID_PROVEEDOR,
T2.FECHA_VENCIMIENTO
FROM productos T1
JOIN lotes_productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
WHERE T2.FECHA_COMPRA = (SELECT MAX(FECHA_COMPRA) FROM lotes_productos WHERE ID_PRODUCTO = P_IDPRODUCTO);
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_35_SELECT_CONTACTO` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT DISTINCT T1.NOMBRE_CONTACTO FROM proveedores T1
JOIN productos T2 on T2.ID_PROVEEDOR = T1.ID_PROVEEDOR
JOIN usuario_empresa T3 on T3.ID_EMPRESA = T2.ID_EMPRESA
WHERE T3.ID_USUARIO = P_IDUSUARIO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_36_ACTUALIZAR_ESTADO_PROVEEDOR` (IN `P_IDPROVEEDOR` INT, IN `P_ID_ESTADO` INT)  NO SQL BEGIN
	UPDATE proveedores SET ID_ESTADO = P_ID_ESTADO WHERE ID_PROVEEDOR = P_IDPROVEEDOR;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_37_SELECT_PRODUCTOS_FILTRO` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT DISTINCT
    T1.ID_PROVEEDOR,
    T1.NOMBRE_PROVEEDOR
FROM proveedores T1
/*JOIN productos T2 ON T1.ID_PROVEEDOR = T2.ID_PROVEEDOR
WHERE T2.ID_EMPRESA = (
    SELECT T1.ID_EMPRESA 
    FROM usuario_empresa T1
    JOIN empresas T2 ON T1.ID_EMPRESA = T2.ID_EMPRESA
    WHERE ID_USUARIO = P_IDUSUARIO
)*/
JOIN usuario_empresa T2 ON T1.ID_EMPRESA = T2.ID_EMPRESA
;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_38_SELECT_REGION` ()  NO SQL BEGIN
	SELECT ID_REGION, NOMBRE_REGION FROM region;
    
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_39_SELECT_COMUNA` (IN `P_IDREGION` INT)  NO SQL BEGIN
	SELECT ID_COMUNA, NOMBRE_COMUNA FROM comuna
	where ID_REGION = P_IDREGION;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_40_SELECT_CIUDAD` (IN `P_IDCOMUNA` INT)  NO SQL BEGIN
	SELECT ID_CIUDAD,NOMBRE_CIUDAD FROM ciudad WHERE ID_COMUNA = P_IDCOMUNA;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_41_NUEVO_PROVEEDOR` (IN `P_IDUSUARIO` INT, IN `P_NOMBRE_PROVEEDOR` VARCHAR(100), IN `P_NOMBRE_CONTACTO` VARCHAR(100), IN `P_TELEFONO` VARCHAR(20), IN `P_EMAIL` VARCHAR(50), IN `P_NOMBRE_CALLE` VARCHAR(100), IN `P_NUMERO_CALLE` INT, IN `P_ID_REGION` INT, IN `P_ID_COMUNA` INT, IN `P_ID_CIUDAD` INT)  NO SQL BEGIN
-- Asignación de la variable con SET
SET @P_ID_DIRECCION = NULL;
SET @P_ID_EMPRESA = (SELECT ID_EMPRESA FROM usuario_empresa WHERE ID_USUARIO = P_IDUSUARIO);
-- Insertar en la tabla direcciones
INSERT INTO direcciones (CALLE, NUMERO, ID_CIUDAD) 
VALUES (P_NOMBRE_CALLE, P_NUMERO_CALLE, P_ID_CIUDAD);

-- Obtener el último ID insertado
SET @P_ID_DIRECCION = LAST_INSERT_ID();

-- Insertar en la tabla proveedores utilizando el último ID de dirección
INSERT INTO proveedores (NOMBRE_PROVEEDOR, NOMBRE_CONTACTO, TELEFONO_CONTACTO, EMAIL_CONTACTO, ID_DIRECCION, ID_ESTADO, ID_EMPRESA)
VALUES (P_NOMBRE_PROVEEDOR, P_NOMBRE_CONTACTO, P_TELEFONO, P_EMAIL, @P_ID_DIRECCION, 1, @P_ID_EMPRESA);



END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_42_ACTUALIZAR_PROVEEDOR` (IN `P_IDPROVEEDOR` INT, IN `P_NOMBRE_PROVEEDOR` VARCHAR(100), IN `P_NOMBRE_CONTACTO` VARCHAR(100), IN `P_TELEFONO` VARCHAR(20), IN `P_EMAIL` VARCHAR(100), IN `P_NOMBRE_CALLE` VARCHAR(100), IN `P_NUMERO_CALLE` INT, IN `P_IDCIUDAD` INT, IN `P_IDCOMUNA` INT, IN `P_IDREGION` INT)  NO SQL BEGIN
-- Declarar variable para almacenar el ID de la dirección
SET @P_IDDIRECCION = 0;

-- Actualizar datos del proveedor
UPDATE proveedores 
SET 
    NOMBRE_PROVEEDOR = P_NOMBRE_PROVEEDOR,
    NOMBRE_CONTACTO = P_NOMBRE_CONTACTO,
    TELEFONO_CONTACTO = P_TELEFONO,
    EMAIL_CONTACTO = P_EMAIL
WHERE 
    ID_PROVEEDOR = P_IDPROVEEDOR;

-- Seleccionar ID_DIRECCION de la tabla proveedores y guardarlo en @P_IDDIRECCION
SELECT ID_DIRECCION 
INTO @P_IDDIRECCION 
FROM proveedores
WHERE ID_PROVEEDOR = P_IDPROVEEDOR;

-- Actualizar dirección con el ID recuperado
UPDATE direcciones 
SET 
    CALLE = P_NOMBRE_CALLE,
    NUMERO = P_NUMERO_CALLE,
    ID_CIUDAD = P_IDCIUDAD
WHERE 
    ID_DIRECCION = @P_IDDIRECCION;

select 1 as VALIDACION;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_43_DATOS_LOTES` (IN `P_IDPRODUCTO` INT, IN `P_IDLOTE` INT)  NO SQL BEGIN
	SELECT CANTIDAD, PRECIO_COMPRA,PRECIO_VENTA, FECHA_VENCIMIENTO, FECHA_COMPRA FROM lotes_productos
    WHERE ID_LOTE = P_IDLOTE AND ID_PRODUCTO = P_IDPRODUCTO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_44_TABLA_NIVELES` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    T1.ID_PRODUCTO,
    T3.NOMBRE_PRODUCTO,
    SUM(T1.CANTIDAD) AS CANTIDAD,
    CASE
        WHEN SUM(T1.CANTIDAD) < T2.CRITICO THEN 'BAJO CRITICO'
        WHEN SUM(T1.CANTIDAD) > T2.CRITICO AND SUM(T1.CANTIDAD) <= T2.MINIMO THEN 'CRITICO'
        WHEN SUM(T1.CANTIDAD) > T2.MINIMO AND SUM(T1.CANTIDAD) <= T2.BIEN THEN 'MINIMO'
        WHEN SUM(T1.CANTIDAD) > T2.BIEN AND SUM(T1.CANTIDAD) <= T2.SOBRE_STOCK THEN 'BIEN'
        WHEN SUM(T1.CANTIDAD) > T2.SOBRE_STOCK THEN 'SOBRE_STOCK'
        WHEN SUM(T1.CANTIDAD) < 3 THEN 'SIN MOVIMIENTOS'   
        ELSE 'SIN MOVIMIENTOS'
    END AS ESTADO,
    IFNULL(CONCAT(CAST(T2.BIEN AS CHAR), '-', CAST(T2.SOBRE_STOCK AS CHAR)), '0') AS IDEAL
FROM 
    lotes_productos T1
LEFT JOIN 
    niveles_criticidad T2 
    ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN
    productos T3
    ON T1.ID_PRODUCTO = T3.ID_PRODUCTO
JOIN
	usuario_empresa T4
    ON T3.ID_EMPRESA = T4.ID_EMPRESA
WHERE 
    T1.FECHA_VENCIMIENTO > CURDATE()
    AND T4.ID_USUARIO = P_IDUSUARIO
GROUP BY 
    T1.ID_PRODUCTO, T3.NOMBRE_PRODUCTO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_45_REPORTE_MOVIMIENTOS` (IN `P_IDUSUARIO` INT)  NO SQL SELECT 
    t3.ID_PRODUCTO,
    t3.NOMBRE_PRODUCTO,
    COUNT(t1.ID_MOVIMIENTO) AS NUM_MOVIMIENTOS,
    CASE
        WHEN COUNT(t1.ID_MOVIMIENTO) = 0 THEN 'SIN MOVIMIENTOS'
        WHEN COUNT(t1.ID_MOVIMIENTO) <= 
            (SELECT AVG(subquery.COUNT_MOVIMIENTOS) * 0.5
             FROM (
                 SELECT 
                     COUNT(dm.ID_MOVIMIENTO) AS COUNT_MOVIMIENTOS
                 FROM 
                     detalle_movimiento dm
                 JOIN 
                     movimientos m ON dm.ID_MOVIMIENTO = m.ID_MOVIMIENTO
                 JOIN 
                     productos p ON p.ID_PRODUCTO = dm.ID_PRODUCTO
                 JOIN 
                     usuario_empresa ue ON p.ID_EMPRESA = ue.ID_EMPRESA
                 WHERE 
                     m.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
                     AND ue.ID_USUARIO = P_IDUSUARIO
                 GROUP BY 
                     dm.ID_PRODUCTO
             ) subquery) THEN 'POCOS MOVIMIENTOS'
        ELSE 'HARTOS MOVIMIENTOS'
    END AS ESTADO
FROM 
    productos t3
LEFT JOIN 
    detalle_movimiento t1 ON t3.ID_PRODUCTO = t1.ID_PRODUCTO
LEFT JOIN 
    movimientos t2 ON t1.ID_MOVIMIENTO = t2.ID_MOVIMIENTO
JOIN 
    usuario_empresa t4 ON t4.ID_EMPRESA = t3.ID_EMPRESA
WHERE 
    (t2.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) OR t2.ID_MOVIMIENTO IS NULL)
    AND t4.ID_USUARIO = P_IDUSUARIO
GROUP BY 
    t3.ID_PRODUCTO, t3.NOMBRE_PRODUCTO$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_46_TOP_GANANCIAS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    T2.NOMBRE_PRODUCTO, 
    (T1.CANTIDAD * (T1.PRECIO - T1.DESCUENTO - T5.PRECIO_COMPRA)) AS GANANCIA
FROM 
    detalle_movimiento T1
JOIN 
    productos T2
ON 
    T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN
	usuario_empresa T3
ON 
	T2.ID_EMPRESA = T3.ID_EMPRESA
JOIN 
    movimientos T4
ON 
    T1.ID_MOVIMIENTO = T4.ID_MOVIMIENTO
JOIN 
    lotes_productos T5
ON 
    T1.ID_LOTE = T5.ID_LOTE
WHERE 
    T3.ID_USUARIO = 1
AND 
    T4.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 
T2.NOMBRE_PRODUCTO
ORDER BY 
    GANANCIA DESC
LIMIT 5;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_47_TOP_VENTAS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    T2.NOMBRE_PRODUCTO, 
    SUM(T1.CANTIDAD) AS CANTIDAD
FROM 
    detalle_movimiento T1
JOIN 
    productos T2
ON 
    T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN 
    usuario_empresa T3
ON 
    T2.ID_EMPRESA = T3.ID_EMPRESA
JOIN 
    movimientos T4
ON 
    T1.ID_MOVIMIENTO = T4.ID_MOVIMIENTO
WHERE 
    T3.ID_USUARIO = P_IDUSUARIO
AND 
    T4.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY 
    T1.ID_PRODUCTO, T2.NOMBRE_PRODUCTO
ORDER BY 
    CANTIDAD DESC
LIMIT 5;

END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_48_GANANCIAS_TOTALES` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    (T1.CANTIDAD * (T1.PRECIO - T1.DESCUENTO - T5.PRECIO_COMPRA)) AS GANANCIA
FROM 
    detalle_movimiento T1
JOIN 
    productos T2
ON 
    T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN
	usuario_empresa T3
ON 
	T2.ID_EMPRESA = T3.ID_EMPRESA
JOIN 
    movimientos T4
ON 
    T1.ID_MOVIMIENTO = T4.ID_MOVIMIENTO
JOIN 
    lotes_productos T5
ON 
    T1.ID_LOTE = T5.ID_LOTE
WHERE 
    T3.ID_USUARIO = P_IDUSUARIO
AND 
    T4.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY 
    GANANCIA DESC
LIMIT 5;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_49_TOTAL_VENTAS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    SUM(T1.CANTIDAD * (T1.PRECIO - T1.DESCUENTO)) AS VENTA
FROM 
    detalle_movimiento T1
JOIN 
    productos T2
ON 
    T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN
	usuario_empresa T3
ON 
	T2.ID_EMPRESA = T3.ID_EMPRESA
JOIN 
    movimientos T4
ON 
    T1.ID_MOVIMIENTO = T4.ID_MOVIMIENTO
WHERE 
    T3.ID_USUARIO = P_IDUSUARIO
AND 
    T4.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY 
    VENTA DESC;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_50_VENTAS_POR_USUARIO` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT 
    T5.NOMBRE, T5.APATERNO AS APELLIDO ,SUM(T1.CANTIDAD * (T1.PRECIO - T1.DESCUENTO)) AS VENTA
FROM 
    detalle_movimiento T1
JOIN 
    productos T2
ON 
    T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN
	usuario_empresa T3
ON 
	T2.ID_EMPRESA = T3.ID_EMPRESA
JOIN 
    movimientos T4
ON 
    T1.ID_MOVIMIENTO = T4.ID_MOVIMIENTO
JOIN 
    usuarios T5
ON 
    T4.ID_USUARIO = T5.ID_USUARIO
WHERE 
    T3.ID_USUARIO = P_IDUSUARIO
AND 
    T4.FECHA_MOVIMIENTO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY
	T4.ID_USUARIO
ORDER BY 
    VENTA DESC;
    
END$$

CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_51_REPORTE_MERMAS` (IN `P_IDUSUARIO` INT)  NO SQL BEGIN
SELECT T1.ID_PRODUCTO, T1.ID_LOTE, T1.NOMBRE_PRODUCTO, T1.CANTIDAD_VENCIDA, T1.FECHA_VENCIMIENTO, T2.PRECIO_COMPRA * T1.cantidad_vencida AS COSTO_MERMA, 'PRODUCTO VENCIDO' AS RAZON_MERMA FROM productos_vencidos T1
JOIN lotes_productos T2 ON T1.id_lote = T2.ID_LOTE AND T2.ID_PRODUCTO = T1.id_producto
JOIN productos T3 ON T1.id_producto = T3.ID_PRODUCTO
JOIN usuario_empresa T4 ON T3.ID_EMPRESA = T4.ID_EMPRESA
WHERE T1.FECHA_REGISTRO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) AND T4.ID_USUARIO = P_IDUSUARIO AND T1.cantidad_vencida > 0

UNION ALL

SELECT T1.ID_PRODUCTO, T1.ID_LOTE, T2.NOMBRE_PRODUCTO, T1.CANTIDAD, T3.FECHA_VENCIMIENTO, T1.COSTO_MERMA, T4.DESCRIPCION_RAZON  FROM productos_merma T1
JOIN productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN lotes_productos T3 ON T1.id_lote = T3.ID_LOTE
JOIN razon_merma T4 ON T1.RAZON_MERMA = T4.ID_RAZON_MERMA
JOIN usuario_empresa T5 ON T2.ID_EMPRESA = T5.ID_EMPRESA
WHERE T1.FECHA_REGISTRO > DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY) AND T5.ID_USUARIO = P_IDUSUARIO AND T1.CANTIDAD > 0;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_gasto_operativo`
--

CREATE TABLE `categorias_gasto_operativo` (
  `ID_CATEGORIA` int NOT NULL,
  `DESCRIPCION_CATEGORIA` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `categorias_gasto_operativo`
--

INSERT INTO `categorias_gasto_operativo` (`ID_CATEGORIA`, `DESCRIPCION_CATEGORIA`) VALUES
(1, 'RECREACION'),
(2, 'MANTENIMIENTO'),
(3, 'INSUMOS'),
(4, 'SERVICIOS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_movimientos`
--

CREATE TABLE `categorias_movimientos` (
  `ID_CATEGORIA` int NOT NULL,
  `DESCRIPCION` varchar(50) DEFAULT NULL,
  `ID_TIPO_MOVIMIENTO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `categorias_movimientos`
--

INSERT INTO `categorias_movimientos` (`ID_CATEGORIA`, `DESCRIPCION`, `ID_TIPO_MOVIMIENTO`) VALUES
(1, 'COMPRA', 1),
(2, 'REEMBOLSO', 1),
(3, 'VENTA', 2),
(4, 'GASTO OPERATIVO', 2),
(5, 'REEMBOLSO PROVEEDOR', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ciudad`
--

CREATE TABLE `ciudad` (
  `ID_CIUDAD` int NOT NULL,
  `NOMBRE_CIUDAD` varchar(100) NOT NULL,
  `ID_COMUNA` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `ciudad`
--

INSERT INTO `ciudad` (`ID_CIUDAD`, `NOMBRE_CIUDAD`, `ID_COMUNA`) VALUES
(1, 'Las Condes', 1),
(2, 'VIÑA DEL MAR', 29),
(5, 'Alhué', 10),
(6, 'Buin', 9),
(7, 'Cerrillos', 1),
(8, 'Cerro Navia', 1),
(9, 'Colina', 7),
(10, 'Conchalí', 1),
(11, 'El Bosque', 1),
(12, 'Estación Central', 1),
(13, 'Huechuraba', 1),
(14, 'Independencia', 1),
(15, 'La Cisterna', 1),
(16, 'La Florida', 1),
(17, 'La Granja', 1),
(18, 'La Pintana', 1),
(19, 'Lampa', 7),
(20, 'Lo Barnechea', 1),
(21, 'Lo Espejo', 1),
(22, 'Lo Prado', 1),
(23, 'Macul', 1),
(24, 'Maipú', 1),
(25, 'María Pinto', 10),
(26, 'Melipilla', 10),
(27, 'Ñuñoa', 1),
(28, 'Padre Hurtado', 11),
(29, 'Paine', 9),
(30, 'Pedro Aguirre Cerda', 1),
(31, 'Peñalolén', 1),
(32, 'Pirque', 8),
(33, 'Providencia', 1),
(34, 'Pudahuel', 1),
(35, 'Quilicura', 1),
(36, 'Quinta Normal', 1),
(37, 'Recoleta', 1),
(38, 'Renca', 1),
(39, 'San Bernardo', 9),
(40, 'San Joaquín', 1),
(41, 'San José de Maipo', 8),
(42, 'San Miguel', 1),
(43, 'San Ramón', 1),
(45, 'Talagante', 11),
(46, 'Vitacura', 1),
(47, 'El Monte', 11),
(48, 'Puente Alto', 8),
(49, 'La Reina', 1),
(51, 'Santiago', 1),
(56, 'Algarrobo', 30),
(57, 'Cabildo', 25),
(58, 'Calera', 28),
(59, 'Concón', 29),
(61, 'El Quisco', 30),
(62, 'El Tabo', 30),
(63, 'Hijuelas', 28),
(64, 'Juan Fernández', 29),
(65, 'La Ligua', 25),
(68, 'Limache', 28),
(70, 'Olmué', 28),
(71, 'Panquehue', 27),
(72, 'Puchuncaví', 29),
(73, 'Quillota', 28),
(74, 'Quilpué', 29),
(75, 'Valparaiso', 29),
(76, 'villa alemana', 29),
(77, 'Alto Biobío', 40),
(78, 'Antuco', 40),
(79, 'Arauco', 42),
(81, 'Cabrero', 40),
(82, 'Chiguayante', 41),
(83, 'Concepción', 41),
(84, 'Contulmo', 42),
(85, 'Coronel', 41),
(86, 'Curanilahue', 42),
(87, 'Florida', 41),
(88, 'Hualpén', 40),
(89, 'Hualqui', 41),
(90, 'Laja', 40),
(91, 'Lebu', 42),
(92, 'Los Álamos', 42),
(93, 'Los Ángeles', 39),
(94, 'Mulchén', 40),
(95, 'Nacimiento', 40),
(96, 'Penco', 41),
(97, 'Quilaco', 40),
(98, 'Quilleco', 40),
(99, 'San Carlos', 39),
(100, 'San Pedro de la Paz', 41),
(101, 'Santa Bárbara', 40),
(102, 'Santa Juana', 41),
(103, 'Talcahuano', 41),
(104, 'Tirúa', 42),
(105, 'Tomé', 41),
(106, 'Victoria', 43),
(107, 'Yumbel', 40),
(108, 'Antofagasta', 18),
(109, 'Calama', 17),
(110, 'Taltal', 18),
(111, 'Mejillones', 18),
(112, 'Sierra Gorda', 18),
(113, 'San Pedro de Atacama', 17),
(114, 'Vallenar', 21),
(115, 'Arica', 12),
(116, 'Camarones', 12),
(117, 'General Lagos', 13),
(118, 'Putre', 13),
(119, 'Iquique', 14),
(120, 'Alto Hospicio', 14),
(121, 'Camiña', 15),
(122, 'Colchane', 15),
(123, 'Huara', 15),
(124, 'Pica', 15),
(125, 'Pozo Almonte', 15),
(126, 'Copiapó', 20),
(127, 'Caldera', 20),
(128, 'Tierra Amarilla', 20),
(130, 'Freirina', 21),
(131, 'Huasco', 21),
(132, 'Alto del Carmen', 21),
(133, 'Chañaral', 19),
(134, 'Diego de Almagro', 19),
(135, 'Andacollo', 22),
(136, 'Coquimbo', 22),
(137, 'La Higuera', 22),
(138, 'La Serena', 22),
(139, 'Vicuña', 22),
(140, 'Combarbalá', 23),
(141, 'Monte Patria', 23),
(142, 'Ovalle', 23),
(143, 'Punitaqui', 23),
(144, 'Río Hurtado', 23),
(145, 'Illapel', 24),
(146, 'Los Vilos', 24),
(147, 'Salamanca', 24),
(148, 'Canela', 24),
(150, 'Rancagua', 32),
(151, 'Graneros', 32),
(152, 'Machalí', 32),
(153, 'Malloa', 32),
(154, 'Mostazal', 32),
(155, 'Doñihue', 32),
(156, 'Codegua', 32),
(157, 'Quinta de Tilcoco', 32),
(158, 'San Vicente de Tagua Tagua', 32),
(159, 'Pichidegua', 32),
(160, 'Peumo', 32),
(161, 'Chimbarongo', 33),
(162, 'Placilla', 33),
(163, 'Palmilla', 33),
(164, 'Peralillo', 33),
(165, 'La Estrella', 34),
(166, 'Lolol', 33),
(167, 'Nancagua', 33),
(168, 'San Fernando', 33),
(169, 'Santa Cruz', 33),
(170, 'Chépica', 33),
(171, 'Paredones', 34),
(172, 'Litueche', 34),
(173, 'Marchigüe', 34),
(175, 'Coltauco', 32),
(176, 'Rengo', 32),
(177, 'Requínoa', 32),
(178, 'Las Cabras', 32),
(183, 'Talca', 36),
(184, 'Curicó', 35),
(185, 'Molina', 35),
(186, 'Linares', 37),
(187, 'San Clemente', 36),
(188, 'San Javier', 37),
(189, 'Constitución', 36),
(190, 'Rauco', 35),
(191, 'Teno', 35),
(192, 'Hualañé', 35),
(193, 'Sagrada Familia', 35),
(194, 'Villa Alegre', 37),
(195, 'Cauquenes', 38),
(196, 'Chanco', 38),
(197, 'Pelluhue', 38),
(198, 'Colbún', 37),
(199, 'Retiro', 37),
(200, 'Parral', 37),
(201, 'Longaví', 37),
(202, 'San Rafael', 36),
(203, 'Panguipulli', 45),
(204, 'Pelarco', 36),
(205, 'Pichilemu', 34),
(211, 'Licantén', 35),
(212, 'San Felipe', 27),
(213, 'Chillán', 39),
(214, 'Chillán Viejo', 39),
(215, 'Bulnes', 39),
(216, 'Coihueco', 39),
(217, 'El Carmen', 39),
(218, 'Ninhue', 39),
(219, 'Pemuco', 39),
(220, 'Quirihue', 39),
(221, 'Ránquil', 39),
(223, 'San Fabián', 39),
(224, 'San Ignacio', 39),
(225, 'San Nicolás', 39),
(227, 'Yungay', 39),
(228, 'Pinto', 39),
(230, 'Cobquecura', 39),
(234, 'Temuco', 44),
(235, 'Carahue', 44),
(236, 'Cunco', 44),
(237, 'Curarrehue', 44),
(238, 'Freire', 44),
(239, 'Galvarino', 44),
(240, 'Gorbea', 44),
(241, 'Loncoche', 44),
(242, 'Melipeuco', 44),
(243, 'Nueva Imperial', 44),
(244, 'Padre Las Casas', 44),
(245, 'Perquenco', 44),
(246, 'Pitrufquén', 44),
(247, 'Pucón', 44),
(248, 'Saavedra', 44),
(249, 'Teodoro Schmidt', 44),
(251, 'Vilcún', 44),
(252, 'Villarrica', 44),
(253, 'Cholchol', 44),
(254, 'Collipulli', 43),
(255, 'Curacautín', 43),
(256, 'Lonquimay', 43),
(257, 'Renaico', 43),
(258, 'Angol', 43),
(259, 'Ercilla', 43),
(261, 'Purén', 43),
(262, 'Lumaco', 43),
(263, 'Los Sauces', 43),
(264, 'Traiguén', 43),
(266, 'Valdivia', 45),
(267, 'Lanco', 45),
(268, 'Los Lagos', 45),
(269, 'Máfil', 45),
(270, 'Mariquina', 45),
(271, 'Paillaco', 45),
(273, 'Río Bueno', 46),
(274, 'Futrono', 46),
(275, 'La Unión', 46),
(276, 'Lago Ranco', 46),
(277, 'Corral', 45),
(278, 'Puerto Montt', 48),
(279, 'Puerto Varas', 48),
(280, 'Osorno', 47),
(281, 'Ancud', 49),
(282, 'Castro', 49),
(283, 'Chonchi', 48),
(284, 'Dalcahue', 49),
(285, 'Puqueldón', 49),
(286, 'Queilen', 49),
(287, 'Quinchao', 49),
(288, 'Calbuco', 48),
(289, 'Maullín', 48),
(290, 'Frutillar', 48),
(291, 'Fresia', 48),
(292, 'Los Muermos', 48),
(293, 'Purranque', 47),
(294, 'San Juan de la Costa', 47),
(295, 'San Pablo', 47),
(296, 'Puerto Octay', 47),
(298, 'Hualaihué', 50),
(299, 'Puyehue', 47),
(300, 'Llanquihue', 48),
(305, 'Palena', 50),
(307, 'Futaleufú', 50),
(308, 'Coyhaique', 51),
(309, 'Aysén', 52),
(310, 'Cisnes', 52),
(311, 'Guaitecas', 52),
(312, 'Lago Verde', 51),
(314, 'Rio Ibáñez', 53),
(315, 'Chile Chico', 53),
(318, 'Punta Arenas', 56),
(319, 'Puerto Natales', 58),
(320, 'Porvenir', 57),
(321, 'Cabo de Hornos', 58),
(322, 'Primavera', 57),
(323, 'San Gregorio', 56),
(324, 'Río Verde', 56),
(325, 'Laguna Blanca', 56),
(327, 'Antártica', 58),
(329, 'Tocopilla', 16),
(330, 'Petorca', 25),
(331, 'Los Andes', 26),
(332, 'San Antonio', 30),
(333, 'Isla de Pascua', 31),
(334, 'Cochrane', 54),
(335, 'Tortel', 54),
(336, 'Torres del Paine', 58);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comuna`
--

CREATE TABLE `comuna` (
  `ID_COMUNA` int NOT NULL,
  `NOMBRE_COMUNA` varchar(100) NOT NULL,
  `ID_REGION` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `comuna`
--

INSERT INTO `comuna` (`ID_COMUNA`, `NOMBRE_COMUNA`, `ID_REGION`) VALUES
(1, 'SANTIAGO', 1),
(2, 'Quillota', 2),
(3, 'Valparaiso', 2),
(4, 'san Antonio', 2),
(5, 'Isla de Pascua', 2),
(6, 'Cachapoal', 2),
(7, 'Chacabuco', 1),
(8, 'Cordillera', 1),
(9, 'Maipo', 1),
(10, 'Melipilla', 1),
(11, 'Talagante', 1),
(12, 'Arica', 5),
(13, 'Parinacota', 5),
(14, 'Iquique', 6),
(15, 'Del Tamarugal', 6),
(16, 'Tocopilla', 4),
(17, 'El loa', 4),
(18, 'Antofagasta', 4),
(19, 'Chañaral', 7),
(20, 'Copiapó', 7),
(21, 'Huasco', 7),
(22, 'Elqui', 8),
(23, 'Limari', 8),
(24, 'Choapa', 8),
(25, 'Petorca', 2),
(26, 'Los Andes', 2),
(27, 'san Felipe de Aconcagua', 2),
(28, 'Quillota', 2),
(29, 'Valparaiso', 2),
(30, 'San Antonio', 2),
(31, 'Isla de Pascua', 2),
(32, 'Cachapoal', 9),
(33, 'Colchagua', 9),
(34, 'Cardenal Caro', 9),
(35, 'Curico', 10),
(36, 'Talca', 10),
(37, 'Linares', 10),
(38, 'Cauquenes', 10),
(39, 'Ñuble', 3),
(40, 'Biobio', 3),
(41, 'Concepcion', 3),
(42, 'Arauco', 3),
(43, 'Malleco', 12),
(44, 'Cautín', 12),
(45, 'Valdivia', 13),
(46, 'Ranco', 13),
(47, 'Osorno', 14),
(48, 'Llanquihue', 14),
(49, 'Chiloé', 14),
(50, 'Palena', 14),
(51, 'Coihaique', 15),
(52, 'Aisén', 15),
(53, 'General Carrera', 15),
(54, 'Capitán Prat', 15),
(55, 'Ultima Esperanza', 16),
(56, 'Magallanes', 16),
(57, 'Tierra del Fuego', 16),
(58, 'Antartica Chilena', 16),
(9999, '', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_movimiento`
--

CREATE TABLE `detalle_movimiento` (
  `ID_DETALLE_MOVIMIENTO` int NOT NULL,
  `ID_MOVIMIENTO` int DEFAULT NULL,
  `ID_LOTE` int DEFAULT NULL,
  `CANTIDAD` int NOT NULL,
  `PRECIO` int NOT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ITEM` int DEFAULT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `DESCUENTO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `detalle_movimiento`
--

INSERT INTO `detalle_movimiento` (`ID_DETALLE_MOVIMIENTO`, `ID_MOVIMIENTO`, `ID_LOTE`, `CANTIDAD`, `PRECIO`, `CREADO_EN`, `ITEM`, `ID_PRODUCTO`, `DESCUENTO`) VALUES
(1, 1, 1234, 10, 310, '2024-11-20 00:25:01', 1, 1, 0),
(2, 1, 14, 5, 7600, '2024-11-20 00:25:01', 2, 1, 0),
(3, 2, 654, 10, 2200, '2024-11-20 00:26:11', 1, 1, 0),
(49, 62, 65482, 5, 5000, '2024-11-20 00:29:02', 1, 17, 0),
(50, 62, 3, 20, 1212, '2024-11-20 00:29:02', 1, 10, 0),
(51, 63, 12, 2, 2900, '2024-11-20 00:29:37', 1, 7, 0),
(52, 64, 2, 1, 7500, '2024-11-20 00:31:58', 1, 5, 0),
(53, 64, 2, 2, 7500, '2024-11-20 00:31:58', 1, 5, 0),
(54, 65, 3, 1, 1212, '2024-11-20 00:32:15', 1, 10, 0),
(55, 66, 2, 1, 7500, '2024-11-20 00:33:19', 1, 5, 50),
(56, 66, 2, 1, 7500, '2024-11-20 00:33:19', 1, 5, 1000),
(57, 67, 5462, 7, 5500, '2024-11-20 00:38:42', 1, 28, 0),
(58, 68, 63215, 220, 7520, '2024-11-20 00:39:30', 1, 2, 0),
(59, 69, 654985, 3, 3500, '2024-11-20 00:40:10', 1, 29, 500),
(60, 70, 567, 12, 2000, '2024-11-20 03:45:18', 1, 14, 0),
(61, 71, 1234, 50, 15000, '2024-11-20 04:07:17', 1, 1, 0),
(62, 72, 63215, 20, 7520, '2024-11-21 08:58:39', 1, 2, 0),
(63, 73, 63215, 10, 7520, '2024-11-21 13:27:27', 1, 2, 0),
(64, 74, 654985, 2, 3500, '2024-11-21 13:35:34', 1, 29, 0),
(65, 75, 63215, 1, 7520, '2024-11-21 18:29:20', 1, 2, 0),
(66, 76, 56978, 5, 3500, '2024-11-21 18:30:02', 1, 32, 0),
(67, 77, 63215, 30, 7520, '2024-11-21 18:32:50', 1, 2, 0),
(68, 78, 4532, 70, 1990, '2024-11-21 18:34:43', 1, 33, 0),
(69, 79, 1, 2, 8750, '2024-11-21 18:41:13', 1, 34, 0),
(70, 80, 2, 10, 8990, '2024-11-21 18:41:34', 1, 35, 0),
(71, 81, 654985, 1, 3500, '2024-11-24 22:20:35', 1, 29, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `ID_DIRECCION` int NOT NULL,
  `CALLE` varchar(255) NOT NULL,
  `NUMERO` int NOT NULL,
  `ID_CIUDAD` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`ID_DIRECCION`, `CALLE`, `NUMERO`, `ID_CIUDAD`) VALUES
(9999, '', 0, NULL),
(10010, 'Avenida Libertador', 123, 1),
(10011, 'Calle Los Álamos', 456, 2),
(10012, 'Pasaje El Sol', 789, 11),
(10013, 'Camino La Luna', 321, 12),
(10014, 'Boulevard Central', 654, 5),
(10015, 'Avenida Las Flores', 987, 6),
(10016, 'Callejón Oscuro', 111, 7),
(10017, 'Calle Nueva', 222, 8),
(10018, 'Pasaje Cerrado', 333, 9),
(10019, 'Ruta del Norte', 444, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `ID_EMPRESA` int NOT NULL,
  `NOMBRE_EMPRESA` varchar(100) NOT NULL,
  `TELEFONO_EMPRESA` int DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ESTADO` int DEFAULT NULL,
  `USUARIO_ACTUALIZA` int DEFAULT NULL,
  `RUT_EMPRESA` varchar(20) NOT NULL,
  `ID_DIRECCION` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`ID_EMPRESA`, `NOMBRE_EMPRESA`, `TELEFONO_EMPRESA`, `CREADO_EN`, `ESTADO`, `USUARIO_ACTUALIZA`, `RUT_EMPRESA`, `ID_DIRECCION`) VALUES
(1, 'TECH SOLUTIONS', 600, '2024-09-29 03:28:58', 1, 1, '76.123.456-7', 10016),
(2, 'INNOVATIVE IDEAS', 600, '2024-09-29 03:28:58', 1, 2, '65.789.012-3', 10013),
(3, 'EMPRESA DE PRUEBA', 123, '2024-10-07 03:01:05', 1, 1, '21548743-1', 10017);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado`
--

CREATE TABLE `estado` (
  `ID_ESTADO` int NOT NULL,
  `DESCRIPCION_ESTADO` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `estado`
--

INSERT INTO `estado` (`ID_ESTADO`, `DESCRIPCION_ESTADO`) VALUES
(1, 'ACTIVO'),
(2, 'INACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos_operativos`
--

CREATE TABLE `gastos_operativos` (
  `ID_GASTO_OPERATIVO` int NOT NULL,
  `DESCRIPCION_GASTO` varchar(100) DEFAULT NULL,
  `FECHA_GASTO` date DEFAULT NULL,
  `MONTO_GASTO` int DEFAULT NULL,
  `ID_EMPRESA` int DEFAULT NULL,
  `ID_CATEGORIA_GASTO_OPERATIVO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `gastos_operativos`
--

INSERT INTO `gastos_operativos` (`ID_GASTO_OPERATIVO`, `DESCRIPCION_GASTO`, `FECHA_GASTO`, `MONTO_GASTO`, `ID_EMPRESA`, `ID_CATEGORIA_GASTO_OPERATIVO`) VALUES
(1, 'Compra de equipo recreativo', '2024-10-01', 500, 1, 1),
(2, 'Mantenimiento de maquinaria', '2024-09-25', 1200, 2, 2),
(3, 'Compra de insumos de oficina', '2024-10-05', 351, 1, 3),
(4, 'Pago de servicios eléctricos', '2024-09-30', 901, 3, 4),
(5, 'Reparación de equipos de recreación', '2024-10-07', 750, 1, 1),
(6, 'SERVICIOS', '2024-10-12', 2, NULL, NULL),
(7, 'SERVICIOS', '2024-10-12', 2, NULL, NULL),
(8, 'MANTENIMIENTO', '2024-10-12', 4, NULL, NULL),
(9, 'MANTENIMIENTO', '2024-10-12', 4, NULL, NULL),
(10, 'MANTENIMIENTO', '2024-10-12', 4, NULL, NULL),
(11, 'INSUMOS', '2024-10-12', 4, NULL, NULL),
(12, 'fds', '2024-10-12', 334, 2, 4),
(13, 'fiesta del weon', '2024-10-17', 100000, 2, 1),
(14, 'jujujuju', '2024-10-17', 900000000, 2, 1),
(15, 'asd', '2024-10-17', 123, 2, 1),
(16, 'Expo tanto', '2024-10-18', 100000, 2, 3),
(17, 'tecito', '2024-11-21', 1000, 2, 1),
(18, 'gasto op', '2024-11-21', 10000, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_precios`
--

CREATE TABLE `historial_precios` (
  `ID_HISTORIAL_PRECIO` int NOT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `PRECIO` int NOT NULL,
  `FECHA_REGISTRO` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `logs_usuarios`
--

CREATE TABLE `logs_usuarios` (
  `ID_LOG` int NOT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  `ACCION` varchar(255) NOT NULL,
  `FECHA_ACCION` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `logs_usuarios`
--

INSERT INTO `logs_usuarios` (`ID_LOG`, `ID_USUARIO`, `ACCION`, `FECHA_ACCION`, `CREADO_EN`) VALUES
(1, 1, 'INICIO DE SESIÓN', '2024-09-29 03:30:22', '2024-09-29 03:30:22'),
(2, 2, 'ACTUALIZACIÓN DE PRODUCTO', '2024-09-29 03:30:22', '2024-09-29 03:30:22'),
(3, 3, 'CREACIÓN DE LOTE', '2024-09-29 03:30:22', '2024-09-29 03:30:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes_productos`
--

CREATE TABLE `lotes_productos` (
  `ID` int NOT NULL,
  `ID_LOTE` int NOT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `FECHA_VENCIMIENTO` date NOT NULL,
  `CANTIDAD` int NOT NULL,
  `PRECIO_COMPRA` int NOT NULL,
  `PRECIO_VENTA` int NOT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `FECHA_COMPRA` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `lotes_productos`
--

INSERT INTO `lotes_productos` (`ID`, `ID_LOTE`, `ID_PRODUCTO`, `FECHA_VENCIMIENTO`, `CANTIDAD`, `PRECIO_COMPRA`, `PRECIO_VENTA`, `CREADO_EN`, `FECHA_COMPRA`) VALUES
(174, 1, 1, '9999-01-01', 101, 123, 12345, '2024-11-19 01:48:17', '2024-10-11'),
(175, 2, 5, '9999-01-01', 9, 90, 100, '2024-11-19 01:48:17', '2024-10-15'),
(176, 3, 10, '9999-01-01', 351, 55, 60, '2024-11-19 01:48:17', '2024-10-15'),
(177, 1234, 5, '9999-01-01', 5, 43256, 76577, '2024-11-19 01:48:17', '2024-10-10'),
(178, 6453473, 5, '9999-01-01', 8, 6356, 98735, '2024-11-19 01:48:17', '2024-10-15'),
(179, 3123, 10, '9999-01-01', 10, 1990, 20000, '2024-11-19 01:48:17', '2024-11-06'),
(180, 654, 1, '9999-01-01', 36782, 2550, 2200, '2024-11-19 01:48:17', '2024-11-06'),
(181, 1234, 1, '2024-11-28', 0, 220, 310, '2024-11-19 01:48:17', '2024-11-13'),
(182, 567, 14, '9999-01-01', 438, 1500, 2000, '2024-11-19 01:48:17', '2024-11-03'),
(183, 777, 5, '9999-01-01', 15, 100066, 67066, '2024-11-19 01:48:17', '2024-10-15'),
(184, 9996, 12, '9999-01-01', 25, 10000, 25000, '2024-11-19 01:48:17', '2024-10-24'),
(185, 123, 5, '9999-01-01', 45, 2200, 2800, '2024-11-19 01:48:17', '2024-10-17'),
(186, 65482, 17, '9999-01-01', 45, 2500, 5000, '2024-11-19 01:48:17', '2024-10-21'),
(187, 3625, 5, '9999-01-01', 5, 3566, 7500, '2024-11-19 01:48:17', '2024-10-22'),
(188, 14, 1, '9999-01-01', 5, 3113, 7600, '2024-11-19 01:48:17', '2024-10-13'),
(189, 3123, 12, '9999-01-01', 30, 5500, 7000, '2024-11-19 01:48:17', '2024-10-10'),
(190, 1234123, 10, '9999-01-01', 705, 1500, 2000, '2024-11-19 01:48:17', '2024-11-05'),
(191, 2222, 10, '9999-01-01', 1212, 1212, 1212, '2024-11-19 01:48:17', '2024-11-06'),
(192, 12, 7, '9999-01-01', 8, 1900, 2900, '2024-11-19 03:05:58', '2024-10-10'),
(193, 5462, 28, '9999-01-01', 0, 1350, 5500, '2024-11-20 00:35:18', '2024-11-19'),
(194, 654985, 29, '9999-01-01', 7, 1250, 3500, '2024-11-20 00:37:02', '2024-11-19'),
(195, 653, 3, '9999-01-01', 0, 5500, 6500, '2024-11-20 00:37:25', '2024-11-19'),
(196, 63215, 2, '9999-01-01', 209, 2600, 7520, '2024-11-20 00:37:58', '2024-11-18'),
(199, 65432, 30, '2024-11-03', 0, 1253, 8860, '2024-11-20 01:16:31', '2024-11-11'),
(200, 8536, 31, '2024-11-04', 0, 2525, 8644, '2024-11-20 01:16:45', '2024-11-11'),
(201, 56978, 32, '2024-11-22', 0, 1200, 3500, '2024-11-20 01:21:30', '2024-11-19'),
(202, 4532, 33, '2024-11-30', 0, 990, 1990, '2024-11-21 13:26:28', '2024-11-21'),
(203, 1, 34, '2025-02-28', 6, 1750, 8750, '2024-11-21 18:39:21', '2024-11-20'),
(204, 2, 35, '2025-04-30', 20, 1990, 8990, '2024-11-21 18:40:48', '2024-11-18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lotes_vencidos`
--

CREATE TABLE `lotes_vencidos` (
  `ID_LOTE_VENCIDO` int NOT NULL,
  `ID_LOTE` int DEFAULT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `CANTIDAD_VENCIDA` int NOT NULL,
  `FECHA_VENCIMIENTO` date NOT NULL,
  `FECHA_REGISTRO` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `lotes_vencidos`
--

INSERT INTO `lotes_vencidos` (`ID_LOTE_VENCIDO`, `ID_LOTE`, `ID_PRODUCTO`, `CANTIDAD_VENCIDA`, `FECHA_VENCIMIENTO`, `FECHA_REGISTRO`) VALUES
(41, 65432, 30, 12, '2024-11-03', '2024-11-21 03:26:25'),
(42, 8536, 31, 5, '2024-11-04', '2024-11-21 03:26:25'),
(84, 56978, 32, 45, '2024-11-22', '2024-11-24 02:30:00'),
(166, 1234, 1, 6526, '2024-11-28', '2024-11-30 02:30:00'),
(250, 4532, 33, 30, '2024-11-30', '2024-12-02 02:30:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `ID_MOVIMIENTO` int NOT NULL,
  `TIPO_MOVIMIENTO` int DEFAULT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  `FECHA_MOVIMIENTO` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `NOTA` varchar(255) DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ID_CATEGORIA` int DEFAULT NULL,
  `ID_TIPO_PAGO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`ID_MOVIMIENTO`, `TIPO_MOVIMIENTO`, `ID_USUARIO`, `NOTA`, `CREADO_EN`, `ID_CATEGORIA`, `ID_TIPO_PAGO`) VALUES
(1, 1, 1, 'ENTRADA DE LAPTOPS AL INVENTARIO', '2024-09-29 03:29:53', 3, 1),
(2, 2, 2, 'SALIDA DE ROUTERS PARA CLIENTE', '2024-09-29 03:29:50', 3, 1),
(3, 1, 6, 'ENTRADA DE IMPRESORAS AL INVENTARIO', '2024-10-05 02:34:32', 3, 1),
(4, 1, 6, 'PRUEBA DE PROCEDIMIENTO', '2024-10-17 02:34:25', 1, 2),
(5, 2, 5, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:34:14', 3, 4),
(6, 2, 5, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:34:11', 3, 4),
(7, 2, 5, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:38:41', 3, 4),
(8, 2, 5, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:38:41', 3, 4),
(9, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:45:17', 3, 3),
(10, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:50:46', 3, 1),
(11, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:50:46', 3, 2),
(14, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-10-17 02:50:46', 3, 4),
(62, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:29:02', 3, 1),
(63, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:29:37', 3, 1),
(64, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:31:58', 3, 1),
(65, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:32:15', 3, 3),
(66, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:33:19', 3, 1),
(67, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:38:42', 3, 1),
(68, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:39:30', 3, 3),
(69, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-20 00:40:10', 3, 3),
(70, 2, 4, 'NOTA QUE SE ELIMINARA', '2024-11-20 03:45:18', 3, 2),
(71, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-20 04:07:17', 3, 2),
(72, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-21 08:58:39', 3, 4),
(73, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-21 13:27:27', 3, 3),
(74, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-21 13:35:34', 3, 2),
(75, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:29:20', 3, 4),
(76, 2, 1, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:30:02', 3, 2),
(77, 2, 2, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:32:50', 3, 3),
(78, 2, 2, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:34:43', 3, 1),
(79, 2, 7, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:41:13', 3, 2),
(80, 2, 7, 'NOTA QUE SE ELIMINARA', '2024-11-21 18:41:34', 3, 4),
(81, 2, 2, 'NOTA QUE SE ELIMINARA', '2024-11-24 22:20:35', 3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `niveles_criticidad`
--

CREATE TABLE `niveles_criticidad` (
  `ID_PRODUCTO` int NOT NULL,
  `CRITICO` int DEFAULT NULL,
  `MINIMO` int DEFAULT NULL,
  `BIEN` int DEFAULT NULL,
  `SOBRE_STOCK` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `niveles_criticidad`
--

INSERT INTO `niveles_criticidad` (`ID_PRODUCTO`, `CRITICO`, `MINIMO`, `BIEN`, `SOBRE_STOCK`) VALUES
(1, 9, 14, 19, 28),
(2, 28, 42, 56, 84),
(5, 1, 1, 1, 2),
(7, 1, 2, 2, 3),
(10, 5, 8, 11, 16),
(14, 6, 9, 12, 18),
(17, 3, 4, 5, 8),
(28, 4, 5, 7, 11),
(29, 1, 2, 2, 3),
(32, 3, 4, 5, 8),
(33, 35, 53, 70, 105),
(34, 1, 2, 2, 3),
(35, 5, 8, 10, 15);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pais`
--

CREATE TABLE `pais` (
  `ID_PAIS` int NOT NULL,
  `NOMBRE_PAIS` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `pais`
--

INSERT INTO `pais` (`ID_PAIS`, `NOMBRE_PAIS`) VALUES
(1, 'CHILE');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ID_PRODUCTO` int NOT NULL,
  `NOMBRE_PRODUCTO` varchar(100) NOT NULL,
  `DESCRIPCION_PRODUCTO` text,
  `UNIDAD_MEDIDA` int DEFAULT NULL,
  `ID_PROVEEDOR` int DEFAULT NULL,
  `ID_EMPRESA` int DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ID_ESTADO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ID_PRODUCTO`, `NOMBRE_PRODUCTO`, `DESCRIPCION_PRODUCTO`, `UNIDAD_MEDIDA`, `ID_PROVEEDOR`, `ID_EMPRESA`, `CREADO_EN`, `ID_ESTADO`) VALUES
(1, 'Melon', 'Melon Calameño', 3, 1, 1, '2024-09-29 03:29:28', 1),
(2, 'MOUSE LOGITECH', 'MOUSE INALÁMBRICO LOGITECH', 3, 1, 1, '2024-09-29 03:29:28', 1),
(3, 'TECLADO MICROSOFT', 'TECLADO ERGONÓMICO MICROSOFT', 3, 1, 1, '2024-09-29 03:29:28', 1),
(4, 'MONITOR SAMSUNG', 'MONITOR SAMSUNG 24 PULGADAS', 3, 1, 2, '2024-09-29 03:29:28', 1),
(5, 'IMPRESORA EPSON', 'IMPRESORA MULTIFUNCIÓN EPSON', 3, 1, 2, '2024-09-29 03:29:28', 1),
(6, 'SILLA ERGONÓMICA', 'SILLA DE OFICINA ERGONÓMICA', 3, 1, 2, '2024-09-29 03:29:28', 1),
(7, 'ESCRITORIO DE MADERA', 'ESCRITORIO DE OFICINA EN MADERA', 3, 1, 2, '2024-09-29 03:29:28', 1),
(8, 'PROYECTOR LG', 'PROYECTOR PORTÁTIL LG', 3, 1, 2, '2024-09-29 03:29:28', 1),
(9, 'CÁMARA WEB LOGITECH', 'CÁMARA WEB HD LOGITECH', 3, 1, 2, '2024-09-29 03:29:28', 1),
(10, 'ROUTER TP-LINK', 'ROUTER INALÁMBRICO TP-LINK', 3, 1, 2, '2024-09-29 03:29:28', 1),
(11, 'Teclado', 'Teclado Gamer Silencioso', 3, 1, 2, '2024-10-05 03:28:40', 1),
(12, 'Rompecabezas', 'JUego rompeCabezas', 1, 1, 2, '2024-10-07 03:03:01', 1),
(13, 'Rueda de juguete', 'Rueda de juguete de goma', 1, 1, 2, '2024-10-07 03:03:31', 1),
(14, 'PISCO ALTO DEL CARMEN', 'PISCO ALTO DEL CARMEN', 1, 1, 2, '2024-10-17 03:24:17', 1),
(15, 'MONITOR MSI', 'MONITOR MSI 27 PULGADAS', 1, 1, 2, '2024-10-17 03:24:17', 1),
(16, 'Palitas', 'Palitas licas', 1, 1, 2, '2024-10-22 00:37:12', 1),
(17, 'Zapatillas', 'Sacate al tiro las zapatilla', 1, 1, 2, '2024-10-22 00:37:12', 1),
(18, 'Polera', 'Polera', 3, 1, 2, '2024-10-22 00:56:18', 1),
(19, 'Pantalon', 'Pantalon negro', 3, 1, 2, '2024-10-22 00:56:18', 1),
(20, 'Audifonos', 'Audifonos RedDragon', 3, 2, 3, '2024-11-02 02:26:09', 1),
(28, 'Alfombras', 'Alfombras de felpa', 3, 1, 1, '2024-11-20 00:35:18', 1),
(29, 'Pelotas', 'Pelotas de futbol', 3, 2, 1, '2024-11-20 00:37:02', 1),
(30, 'Sandias', 'Sandias', 3, 2, 1, '2024-11-20 00:41:14', 1),
(31, 'Tomates', 'Tomates', 1, 1, 1, '2024-11-20 00:41:55', 1),
(32, 'Platanos', 'platanos', 1, 1, 1, '2024-11-20 01:21:30', 1),
(33, 'Producto capstone', 'deswcripcion', 3, 1, 1, '2024-11-21 13:26:28', 1),
(34, 'Pisco Horcón Quemado', 'Pisquera SPA', 2, 5, 3, '2024-11-21 18:39:21', 1),
(35, 'Pisco Alto del Carmen', 'Pisco Alto del Carmen', 2, 5, 3, '2024-11-21 18:40:48', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_merma`
--

CREATE TABLE `productos_merma` (
  `ID_MERMA` int NOT NULL,
  `ID_PRODUCTO` int DEFAULT NULL,
  `ID_LOTE` int DEFAULT NULL,
  `CANTIDAD` int NOT NULL,
  `RAZON_MERMA` int DEFAULT NULL,
  `DESCRIPCION` varchar(255) DEFAULT NULL,
  `COSTO_MERMA` int NOT NULL,
  `FECHA_REGISTRO` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `productos_merma`
--

INSERT INTO `productos_merma` (`ID_MERMA`, `ID_PRODUCTO`, `ID_LOTE`, `CANTIDAD`, `RAZON_MERMA`, `DESCRIPCION`, `COSTO_MERMA`, `FECHA_REGISTRO`) VALUES
(8, 28, 5462, 3, 1, 'alfombra descocida', 14850, '2024-11-20 02:36:19'),
(9, 29, 654985, 2, 1, 'pelotas en  mal estado', 2500, '2024-11-20 02:37:57'),
(10, 3, 653, 9, 1, 'sin teclas', 49500, '2024-11-20 02:39:25'),
(11, 3, 653, 1, 1, 'otro', 5500, '2024-11-20 02:39:52'),
(12, 2, 63215, 10, 1, 'merma', 26000, '2024-11-21 13:28:37'),
(13, 34, 1, 2, 3, 'Botella rota', 246, '2024-11-21 18:43:04');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos_vencidos`
--

CREATE TABLE `productos_vencidos` (
  `id` int NOT NULL,
  `id_producto` int DEFAULT NULL,
  `id_lote` int DEFAULT NULL,
  `nombre_producto` varchar(150) DEFAULT NULL,
  `fecha_vencimiento` date NOT NULL,
  `cantidad_vencida` int NOT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `productos_vencidos`
--

INSERT INTO `productos_vencidos` (`id`, `id_producto`, `id_lote`, `nombre_producto`, `fecha_vencimiento`, `cantidad_vencida`, `fecha_registro`) VALUES
(1456, 30, 65432, 'Sandias', '2024-11-03', 12, '2024-12-02 21:15:39'),
(1457, 31, 8536, 'Tomates', '2024-11-04', 5, '2024-12-02 21:15:39'),
(1458, 32, 56978, 'Platanos', '2024-11-22', 45, '2024-12-02 21:15:39'),
(1460, 33, 4532, 'Producto capstone', '2024-11-30', 30, '2024-12-02 21:15:39'),
(1463, 1, 1234, 'Melon', '2024-11-28', 6526, '2024-12-08 18:53:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `ID_PROVEEDOR` int NOT NULL,
  `NOMBRE_PROVEEDOR` varchar(100) NOT NULL,
  `NOMBRE_CONTACTO` varchar(100) DEFAULT NULL,
  `TELEFONO_CONTACTO` varchar(20) DEFAULT NULL,
  `EMAIL_CONTACTO` varchar(100) DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ID_DIRECCION` int DEFAULT NULL,
  `ID_ESTADO` int DEFAULT NULL,
  `ID_EMPRESA` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`ID_PROVEEDOR`, `NOMBRE_PROVEEDOR`, `NOMBRE_CONTACTO`, `TELEFONO_CONTACTO`, `EMAIL_CONTACTO`, `CREADO_EN`, `ID_DIRECCION`, `ID_ESTADO`, `ID_EMPRESA`) VALUES
(1, 'PROVEEDOR A', 'CARLOS MARTINEZ', '600-111-222', 'CARLOS.MARTINEZ@EXAMPLE.COM', '2024-09-29 03:29:21', 10013, 1, 1),
(2, 'PROVEEDOR B', 'ANDREA FERNANDEZ', '600-333-444', 'ANDREA.FERNANDEZ@EXAMPLE.COM', '2024-09-29 03:29:21', 10016, 1, 1),
(3, 'PROVEEDOR DE PRUEBA', 'PRUEBA', '123', 'NG@NG', '2024-10-07 02:57:50', 10011, 1, 2),
(4, 'Proveedor 1', 'test proveedor', '21333333', 'prov@email.com', '2024-11-21 13:30:04', 10019, 1, 1),
(5, 'Pisquera SPA', 'Pisquera SPA', '+56966666666', 'psiqueraspa@email.com', '2024-11-21 18:38:31', 10014, 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `razon_merma`
--

CREATE TABLE `razon_merma` (
  `ID_RAZON_MERMA` int NOT NULL,
  `DESCRIPCION_RAZON` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `razon_merma`
--

INSERT INTO `razon_merma` (`ID_RAZON_MERMA`, `DESCRIPCION_RAZON`) VALUES
(1, 'DAÑO FÍSICO'),
(2, 'DETERIORO'),
(3, 'ERROR DE PRODUCCIÓN'),
(4, 'PRODUCTO VENCIDO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `region`
--

CREATE TABLE `region` (
  `ID_REGION` int NOT NULL,
  `NOMBRE_REGION` varchar(100) NOT NULL,
  `ID_PAIS` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `region`
--

INSERT INTO `region` (`ID_REGION`, `NOMBRE_REGION`, `ID_PAIS`) VALUES
(1, 'Metropolitana', 1),
(2, 'Valparaiso', 1),
(3, 'BioBio', 1),
(4, 'Antofagasta', 1),
(5, 'Arica y Parinacota', 1),
(6, 'Tarapacá', 1),
(7, 'Atacama', 1),
(8, 'Coquimbo', 1),
(9, 'OHiggins', 1),
(10, 'Maule', 1),
(11, 'Ñuble', 1),
(12, 'Araucanía', 1),
(13, 'Los Ríos', 1),
(14, 'Los Lagos', 1),
(15, 'Aysen', 1),
(16, 'Magallanes y de la Antartica Chilena', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `ID_ROL` int NOT NULL,
  `DESCRIPCION_ROL` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`ID_ROL`, `DESCRIPCION_ROL`) VALUES
(1, 'ADMINISTRADOR'),
(2, 'EMPLEADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_movimiento`
--

CREATE TABLE `tipo_movimiento` (
  `ID_TIPO_MOVIMIENTO` int NOT NULL,
  `DESCRIPCION_MOVIMIENTO` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `tipo_movimiento`
--

INSERT INTO `tipo_movimiento` (`ID_TIPO_MOVIMIENTO`, `DESCRIPCION_MOVIMIENTO`) VALUES
(1, 'ENTRADA'),
(2, 'SALIDA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_pago`
--

CREATE TABLE `tipo_pago` (
  `ID_TIPO_PAGO` int NOT NULL,
  `DESCRIPCION_PAGO` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `tipo_pago`
--

INSERT INTO `tipo_pago` (`ID_TIPO_PAGO`, `DESCRIPCION_PAGO`) VALUES
(1, 'EFECTIVO'),
(2, 'DEBITO'),
(3, 'CREDITO'),
(4, 'TRANSFERENCIA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_medida`
--

CREATE TABLE `unidad_medida` (
  `ID_UNIDAD_MEDIDA` int NOT NULL,
  `DESCRIPCION_UNIDAD` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `unidad_medida`
--

INSERT INTO `unidad_medida` (`ID_UNIDAD_MEDIDA`, `DESCRIPCION_UNIDAD`) VALUES
(1, 'KILOGRAMOS'),
(2, 'LITROS'),
(3, 'UNIDAD');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID_USUARIO` int NOT NULL,
  `NOMBRE_USUARIO` varchar(50) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `CONTRASENIA` varchar(255) NOT NULL,
  `NOMBRE` varchar(50) DEFAULT NULL,
  `APATERNO` varchar(50) DEFAULT NULL,
  `AMATERNO` varchar(50) DEFAULT NULL,
  `TELEFONO` varchar(20) DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ESTADO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID_USUARIO`, `NOMBRE_USUARIO`, `EMAIL`, `CONTRASENIA`, `NOMBRE`, `APATERNO`, `AMATERNO`, `TELEFONO`, `CREADO_EN`, `ESTADO`) VALUES
(1, 'MARIO.ROSSI', 'MARIO.ROSSI@EXAMPLE.COM', 'PASS123', 'MARIO', 'ROSSI', 'MARTINEZ', '555-1234', '2024-09-29 03:28:46', 1),
(2, 'LAURA.GOMEZ', 'LAURA.GOMEZ@EXAMPLE.COM', 'PASS123', 'LAURA', 'GOMEZ', 'PEREZ', '111111', '2024-09-29 03:28:46', 1),
(3, 'JUAN.LOPEZ', 'JUAN.LOPEZ@EXAMPLE.COM', 'PASS123', 'JUAN', 'LOPEZ', 'FERNANDEZ', '555-9101', '2024-09-29 03:28:46', 1),
(4, 'ANA.SILVA', 'ANA.SILVA@EXAMPLE.COM', 'PASS123', 'ANA', 'SILVA', 'HAWKING', '123456789', '2024-09-29 03:28:46', 1),
(5, 'PEDRO.GARCIA', 'PEDRO.GARCIA@EXAMPLE.COM', 'PASS123', 'PEDRO', 'GARCIA', 'RUIZ', '555-4455', '2024-09-29 03:28:46', 1),
(6, 'SARA.MARTINEZ', 'SARA.MARTINEZ@EXAMPLE.COM', 'PASS123', 'SARA', 'MARTINEZ', 'DIAZ', '555-6677', '2024-09-29 03:28:46', 1),
(7, 'BASTIAN.LEYTON', 'BASTIAN.LEYTON@OPTIFLOW.CL', 'PISCOLITA1234', 'BASTIAN', 'LEYTONN', 'MARDONES', '123123213', '2024-10-02 08:39:56', 1),
(8, 'daniel', 'daniel@optiflow.cl', '123', 'daniel', 'caro', 'calderon', '+56988780611', '2024-10-12 20:27:53', 1),
(9, 'USER.USER', 'USER.USER@EMAIL.COM', 'PASS123', 'USER', 'USERR', 'USERRR', '12334256', '2024-10-17 10:34:07', 1),
(10, 'Profe mariela', 'ejemplo@ejemplocom', '1234', 'ejemplo', 'ejemplo apellido', 'ejempleo materno', '11111', '2024-10-17 13:51:30', 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_empresa`
--

CREATE TABLE `usuario_empresa` (
  `ID_USUARIO_EMPRESA` int NOT NULL,
  `ID_USUARIO` int DEFAULT NULL,
  `ID_EMPRESA` int DEFAULT NULL,
  `ROL` int DEFAULT NULL,
  `CREADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ACTUALIZADO_EN` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Volcado de datos para la tabla `usuario_empresa`
--

INSERT INTO `usuario_empresa` (`ID_USUARIO_EMPRESA`, `ID_USUARIO`, `ID_EMPRESA`, `ROL`, `CREADO_EN`) VALUES
(1, 1, 1, 1, '2024-09-29 03:29:08'),
(2, 2, 1, 2, '2024-09-29 03:29:08'),
(3, 3, 1, 2, '2024-09-29 03:29:08'),
(4, 4, 2, 1, '2024-09-29 03:29:08'),
(5, 5, 2, 2, '2024-09-29 03:29:08'),
(6, 6, 2, 2, '2024-09-29 03:29:08'),
(7, 7, 3, 1, '2024-10-03 01:49:02'),
(8, 8, 2, 1, '2024-10-12 20:27:53'),
(9, 9, 1, 2, '2024-10-17 10:34:07'),
(10, 10, 1, 2, '2024-10-17 13:51:30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_gasto_operativo`
--
ALTER TABLE `categorias_gasto_operativo`
  ADD PRIMARY KEY (`ID_CATEGORIA`);

--
-- Indices de la tabla `categorias_movimientos`
--
ALTER TABLE `categorias_movimientos`
  ADD PRIMARY KEY (`ID_CATEGORIA`),
  ADD KEY `ID_TIPO_MOVIMIENTO` (`ID_TIPO_MOVIMIENTO`);

--
-- Indices de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD PRIMARY KEY (`ID_CIUDAD`),
  ADD KEY `ID_COMUNA` (`ID_COMUNA`);

--
-- Indices de la tabla `comuna`
--
ALTER TABLE `comuna`
  ADD PRIMARY KEY (`ID_COMUNA`),
  ADD KEY `ID_REGION` (`ID_REGION`);

--
-- Indices de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  ADD PRIMARY KEY (`ID_DETALLE_MOVIMIENTO`),
  ADD KEY `ID_MOVIMIENTO` (`ID_MOVIMIENTO`),
  ADD KEY `ID_LOTE` (`ID_LOTE`),
  ADD KEY `DETALLE_MOVIMIENTO_ibfk_2` (`ID_LOTE`,`ID_PRODUCTO`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`ID_DIRECCION`),
  ADD KEY `FK_DIRECCIONES_CIUDAD` (`ID_CIUDAD`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`ID_EMPRESA`),
  ADD UNIQUE KEY `RUT_EMPRESA` (`RUT_EMPRESA`),
  ADD KEY `ESTADO` (`ESTADO`),
  ADD KEY `USUARIO_ACTUALIZA` (`USUARIO_ACTUALIZA`),
  ADD KEY `FK_DIRECCION_EMPRESA` (`ID_DIRECCION`);

--
-- Indices de la tabla `estado`
--
ALTER TABLE `estado`
  ADD PRIMARY KEY (`ID_ESTADO`);

--
-- Indices de la tabla `gastos_operativos`
--
ALTER TABLE `gastos_operativos`
  ADD PRIMARY KEY (`ID_GASTO_OPERATIVO`),
  ADD KEY `FK_GastosOperativos_Empresas` (`ID_EMPRESA`),
  ADD KEY `FK_GastosOperativos_Categorias` (`ID_CATEGORIA_GASTO_OPERATIVO`);

--
-- Indices de la tabla `historial_precios`
--
ALTER TABLE `historial_precios`
  ADD PRIMARY KEY (`ID_HISTORIAL_PRECIO`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`);

--
-- Indices de la tabla `logs_usuarios`
--
ALTER TABLE `logs_usuarios`
  ADD PRIMARY KEY (`ID_LOG`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`);

--
-- Indices de la tabla `lotes_productos`
--
ALTER TABLE `lotes_productos`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_lote_producto` (`ID_LOTE`,`ID_PRODUCTO`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`);

--
-- Indices de la tabla `lotes_vencidos`
--
ALTER TABLE `lotes_vencidos`
  ADD PRIMARY KEY (`ID_LOTE_VENCIDO`),
  ADD KEY `ID_LOTE` (`ID_LOTE`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`ID_MOVIMIENTO`),
  ADD KEY `TIPO_MOVIMIENTO` (`TIPO_MOVIMIENTO`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `fk_categoria` (`ID_CATEGORIA`),
  ADD KEY `fk_tipo_pago` (`ID_TIPO_PAGO`);

--
-- Indices de la tabla `niveles_criticidad`
--
ALTER TABLE `niveles_criticidad`
  ADD PRIMARY KEY (`ID_PRODUCTO`);

--
-- Indices de la tabla `pais`
--
ALTER TABLE `pais`
  ADD PRIMARY KEY (`ID_PAIS`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ID_PRODUCTO`),
  ADD KEY `UNIDAD_MEDIDA` (`UNIDAD_MEDIDA`),
  ADD KEY `ID_PROVEEDOR` (`ID_PROVEEDOR`),
  ADD KEY `ID_EMPRESA` (`ID_EMPRESA`),
  ADD KEY `FK_PRODUCTOS_ESTADO` (`ID_ESTADO`);

--
-- Indices de la tabla `productos_merma`
--
ALTER TABLE `productos_merma`
  ADD PRIMARY KEY (`ID_MERMA`),
  ADD KEY `ID_PRODUCTO` (`ID_PRODUCTO`),
  ADD KEY `ID_LOTE` (`ID_LOTE`),
  ADD KEY `RAZON_MERMA` (`RAZON_MERMA`);

--
-- Indices de la tabla `productos_vencidos`
--
ALTER TABLE `productos_vencidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_lote` (`id_lote`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`ID_PROVEEDOR`),
  ADD KEY `FK_DIRECCION_PROVEEDOR` (`ID_DIRECCION`),
  ADD KEY `FK_PROVEEDORES_ESTADO` (`ID_ESTADO`),
  ADD KEY `fk_proveedores_empresas` (`ID_EMPRESA`);

--
-- Indices de la tabla `razon_merma`
--
ALTER TABLE `razon_merma`
  ADD PRIMARY KEY (`ID_RAZON_MERMA`);

--
-- Indices de la tabla `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`ID_REGION`),
  ADD KEY `ID_PAIS` (`ID_PAIS`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`ID_ROL`);

--
-- Indices de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  ADD PRIMARY KEY (`ID_TIPO_MOVIMIENTO`);

--
-- Indices de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  ADD PRIMARY KEY (`ID_TIPO_PAGO`);

--
-- Indices de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  ADD PRIMARY KEY (`ID_UNIDAD_MEDIDA`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID_USUARIO`),
  ADD UNIQUE KEY `NOMBRE_USUARIO` (`NOMBRE_USUARIO`),
  ADD UNIQUE KEY `EMAIL` (`EMAIL`),
  ADD KEY `ESTADO` (`ESTADO`);

--
-- Indices de la tabla `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  ADD PRIMARY KEY (`ID_USUARIO_EMPRESA`),
  ADD KEY `ID_USUARIO` (`ID_USUARIO`),
  ADD KEY `ID_EMPRESA` (`ID_EMPRESA`),
  ADD KEY `ROL` (`ROL`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_gasto_operativo`
--
ALTER TABLE `categorias_gasto_operativo`
  MODIFY `ID_CATEGORIA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categorias_movimientos`
--
ALTER TABLE `categorias_movimientos`
  MODIFY `ID_CATEGORIA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ciudad`
--
ALTER TABLE `ciudad`
  MODIFY `ID_CIUDAD` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=337;

--
-- AUTO_INCREMENT de la tabla `comuna`
--
ALTER TABLE `comuna`
  MODIFY `ID_COMUNA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10000;

--
-- AUTO_INCREMENT de la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  MODIFY `ID_DETALLE_MOVIMIENTO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `ID_DIRECCION` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10020;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `ID_EMPRESA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado`
--
ALTER TABLE `estado`
  MODIFY `ID_ESTADO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `gastos_operativos`
--
ALTER TABLE `gastos_operativos`
  MODIFY `ID_GASTO_OPERATIVO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `historial_precios`
--
ALTER TABLE `historial_precios`
  MODIFY `ID_HISTORIAL_PRECIO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `logs_usuarios`
--
ALTER TABLE `logs_usuarios`
  MODIFY `ID_LOG` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `lotes_productos`
--
ALTER TABLE `lotes_productos`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT de la tabla `lotes_vencidos`
--
ALTER TABLE `lotes_vencidos`
  MODIFY `ID_LOTE_VENCIDO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=341;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `ID_MOVIMIENTO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de la tabla `pais`
--
ALTER TABLE `pais`
  MODIFY `ID_PAIS` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ID_PRODUCTO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `productos_merma`
--
ALTER TABLE `productos_merma`
  MODIFY `ID_MERMA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `productos_vencidos`
--
ALTER TABLE `productos_vencidos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1464;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `ID_PROVEEDOR` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `razon_merma`
--
ALTER TABLE `razon_merma`
  MODIFY `ID_RAZON_MERMA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `region`
--
ALTER TABLE `region`
  MODIFY `ID_REGION` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `ID_ROL` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_movimiento`
--
ALTER TABLE `tipo_movimiento`
  MODIFY `ID_TIPO_MOVIMIENTO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tipo_pago`
--
ALTER TABLE `tipo_pago`
  MODIFY `ID_TIPO_PAGO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `unidad_medida`
--
ALTER TABLE `unidad_medida`
  MODIFY `ID_UNIDAD_MEDIDA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID_USUARIO` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  MODIFY `ID_USUARIO_EMPRESA` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `categorias_movimientos`
--
ALTER TABLE `categorias_movimientos`
  ADD CONSTRAINT `CATEGORIAS_MOVIMIENTOS_ibfk_1` FOREIGN KEY (`ID_TIPO_MOVIMIENTO`) REFERENCES `tipo_movimiento` (`ID_TIPO_MOVIMIENTO`);

--
-- Filtros para la tabla `ciudad`
--
ALTER TABLE `ciudad`
  ADD CONSTRAINT `CIUDAD_ibfk_1` FOREIGN KEY (`ID_COMUNA`) REFERENCES `comuna` (`ID_COMUNA`);

--
-- Filtros para la tabla `comuna`
--
ALTER TABLE `comuna`
  ADD CONSTRAINT `COMUNA_ibfk_1` FOREIGN KEY (`ID_REGION`) REFERENCES `region` (`ID_REGION`);

--
-- Filtros para la tabla `detalle_movimiento`
--
ALTER TABLE `detalle_movimiento`
  ADD CONSTRAINT `DETALLE_MOVIMIENTO_ibfk_1` FOREIGN KEY (`ID_MOVIMIENTO`) REFERENCES `movimientos` (`ID_MOVIMIENTO`),
  ADD CONSTRAINT `DETALLE_MOVIMIENTO_ibfk_2` FOREIGN KEY (`ID_LOTE`,`ID_PRODUCTO`) REFERENCES `lotes_productos` (`ID_LOTE`, `ID_PRODUCTO`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD CONSTRAINT `FK_DIRECCIONES_CIUDAD` FOREIGN KEY (`ID_CIUDAD`) REFERENCES `ciudad` (`ID_CIUDAD`);

--
-- Filtros para la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD CONSTRAINT `EMPRESAS_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `estado` (`ID_ESTADO`),
  ADD CONSTRAINT `EMPRESAS_ibfk_2` FOREIGN KEY (`USUARIO_ACTUALIZA`) REFERENCES `usuarios` (`ID_USUARIO`),
  ADD CONSTRAINT `FK_DIRECCION_EMPRESA` FOREIGN KEY (`ID_DIRECCION`) REFERENCES `direcciones` (`ID_DIRECCION`);

--
-- Filtros para la tabla `gastos_operativos`
--
ALTER TABLE `gastos_operativos`
  ADD CONSTRAINT `FK_GastosOperativos_Categorias` FOREIGN KEY (`ID_CATEGORIA_GASTO_OPERATIVO`) REFERENCES `categorias_gasto_operativo` (`ID_CATEGORIA`),
  ADD CONSTRAINT `FK_GastosOperativos_Empresas` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `empresas` (`ID_EMPRESA`);

--
-- Filtros para la tabla `historial_precios`
--
ALTER TABLE `historial_precios`
  ADD CONSTRAINT `HISTORIAL_PRECIOS_ibfk_1` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos` (`ID_PRODUCTO`);

--
-- Filtros para la tabla `logs_usuarios`
--
ALTER TABLE `logs_usuarios`
  ADD CONSTRAINT `LOGS_USUARIOS_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`);

--
-- Filtros para la tabla `lotes_productos`
--
ALTER TABLE `lotes_productos`
  ADD CONSTRAINT `LOTES_PRODUCTOS_ibfk_1` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos` (`ID_PRODUCTO`);

--
-- Filtros para la tabla `lotes_vencidos`
--
ALTER TABLE `lotes_vencidos`
  ADD CONSTRAINT `LOTES_VENCIDOS_ibfk_2` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos` (`ID_PRODUCTO`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `fk_categoria` FOREIGN KEY (`ID_CATEGORIA`) REFERENCES `categorias_movimientos` (`ID_CATEGORIA`),
  ADD CONSTRAINT `fk_tipo_pago` FOREIGN KEY (`ID_TIPO_PAGO`) REFERENCES `tipo_pago` (`ID_TIPO_PAGO`),
  ADD CONSTRAINT `MOVIMIENTOS_ibfk_1` FOREIGN KEY (`TIPO_MOVIMIENTO`) REFERENCES `tipo_movimiento` (`ID_TIPO_MOVIMIENTO`),
  ADD CONSTRAINT `MOVIMIENTOS_ibfk_2` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`);

--
-- Filtros para la tabla `niveles_criticidad`
--
ALTER TABLE `niveles_criticidad`
  ADD CONSTRAINT `fk_niveles_productos` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos` (`ID_PRODUCTO`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `FK_PRODUCTOS_ESTADO` FOREIGN KEY (`ID_ESTADO`) REFERENCES `estado` (`ID_ESTADO`),
  ADD CONSTRAINT `PRODUCTOS_ibfk_1` FOREIGN KEY (`UNIDAD_MEDIDA`) REFERENCES `unidad_medida` (`ID_UNIDAD_MEDIDA`),
  ADD CONSTRAINT `PRODUCTOS_ibfk_2` FOREIGN KEY (`ID_PROVEEDOR`) REFERENCES `proveedores` (`ID_PROVEEDOR`),
  ADD CONSTRAINT `PRODUCTOS_ibfk_3` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `empresas` (`ID_EMPRESA`);

--
-- Filtros para la tabla `productos_merma`
--
ALTER TABLE `productos_merma`
  ADD CONSTRAINT `PRODUCTOS_MERMA_ibfk_1` FOREIGN KEY (`ID_PRODUCTO`) REFERENCES `productos` (`ID_PRODUCTO`),
  ADD CONSTRAINT `PRODUCTOS_MERMA_ibfk_3` FOREIGN KEY (`RAZON_MERMA`) REFERENCES `razon_merma` (`ID_RAZON_MERMA`);

--
-- Filtros para la tabla `productos_vencidos`
--
ALTER TABLE `productos_vencidos`
  ADD CONSTRAINT `productos_vencidos_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`ID_PRODUCTO`),
  ADD CONSTRAINT `productos_vencidos_ibfk_2` FOREIGN KEY (`id_lote`) REFERENCES `lotes_productos` (`ID_LOTE`);

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `FK_DIRECCION_PROVEEDOR` FOREIGN KEY (`ID_DIRECCION`) REFERENCES `direcciones` (`ID_DIRECCION`),
  ADD CONSTRAINT `fk_proveedores_empresas` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `empresas` (`ID_EMPRESA`),
  ADD CONSTRAINT `FK_PROVEEDORES_ESTADO` FOREIGN KEY (`ID_ESTADO`) REFERENCES `estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `region`
--
ALTER TABLE `region`
  ADD CONSTRAINT `REGION_ibfk_1` FOREIGN KEY (`ID_PAIS`) REFERENCES `pais` (`ID_PAIS`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `USUARIOS_ibfk_1` FOREIGN KEY (`ESTADO`) REFERENCES `estado` (`ID_ESTADO`);

--
-- Filtros para la tabla `usuario_empresa`
--
ALTER TABLE `usuario_empresa`
  ADD CONSTRAINT `USUARIO_EMPRESA_ibfk_1` FOREIGN KEY (`ID_USUARIO`) REFERENCES `usuarios` (`ID_USUARIO`),
  ADD CONSTRAINT `USUARIO_EMPRESA_ibfk_2` FOREIGN KEY (`ID_EMPRESA`) REFERENCES `empresas` (`ID_EMPRESA`),
  ADD CONSTRAINT `USUARIO_EMPRESA_ibfk_3` FOREIGN KEY (`ROL`) REFERENCES `rol` (`ID_ROL`);

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`c2611566_soqus`@`%` EVENT `CALCULO_NIVELES` ON SCHEDULE EVERY 1 DAY STARTS '2024-11-12 01:00:00' ON COMPLETION PRESERVE ENABLE DO BEGIN
    DELETE FROM niveles_criticidad;
    
    INSERT INTO niveles_criticidad (ID_PRODUCTO, CRITICO, MINIMO, BIEN, SOBRE_STOCK)
    SELECT 
        T1.ID_PRODUCTO,
        ROUND(AVG(T1.CANTIDAD) * 0.5),
        ROUND(AVG(T1.CANTIDAD) * 0.75),
        ROUND(AVG(T1.CANTIDAD)),
        ROUND(AVG(T1.CANTIDAD) * 1.5)
    FROM detalle_movimiento T1
    JOIN movimientos T2 ON T1.ID_MOVIMIENTO = T2.ID_MOVIMIENTO
    WHERE T2.ID_CATEGORIA = 3
    GROUP BY T1.ID_PRODUCTO;
END$$

CREATE DEFINER=`c2611566_soqus`@`%` EVENT `PRODUCTOS_VENCIDOS` ON SCHEDULE EVERY 1 DAY STARTS '2024-11-17 23:30:00' ON COMPLETION PRESERVE ENABLE DO BEGIN
-- Inserta registros vencidos en lotes_vencidos
INSERT INTO lotes_vencidos (ID_LOTE, ID_PRODUCTO, CANTIDAD_VENCIDA, FECHA_VENCIMIENTO)
SELECT DISTINCT T1.ID_LOTE, T1.ID_PRODUCTO, T1.CANTIDAD, T1.FECHA_VENCIMIENTO
FROM lotes_productos T1
JOIN productos T2 ON T1.ID_PRODUCTO = T2.ID_PRODUCTO
JOIN usuario_empresa T3 ON T2.ID_EMPRESA = T3.ID_EMPRESA
WHERE T1.FECHA_VENCIMIENTO < CURDATE();

DELETE FROM lotes_vencidos WHERE CANTIDAD_VENCIDA = 0;

-- carga tabla productos vencidos
INSERT INTO productos_vencidos (ID_PRODUCTO, ID_LOTE, nombre_producto, FECHA_VENCIMIENTO ,CANTIDAD_VENCIDA)
SELECT 
    T1.ID_PRODUCTO, 
    T1.ID_LOTE, 
    T2.nombre_producto, 
    T1.FECHA_VENCIMIENTO, 
    T1.CANTIDAD_VENCIDA
FROM 
    lotes_vencidos T1
JOIN 
    productos T2 
    ON T1.ID_PRODUCTO = T2.id_producto
LEFT JOIN 
    productos_vencidos T3 
    ON T3.ID_PRODUCTO = T1.ID_PRODUCTO AND T3.ID_LOTE = T1.ID_LOTE
WHERE 
    T1.CANTIDAD_VENCIDA != 0 
    AND T3.ID_PRODUCTO IS NULL;


-- Actualiza la cantidad de los registros vencidos a 0
UPDATE lotes_productos T1
JOIN lotes_vencidos T2 ON T1.ID_LOTE = T2.ID_LOTE AND T1.ID_PRODUCTO = T2.ID_PRODUCTO
SET T1.CANTIDAD = 0;

END$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
