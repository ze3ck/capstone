CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_06_ACTUALIZAR_ESTADO_USUARIO` (IN `p_ID_USUARIO` INT, IN `p_IDESTADO` INT)   
BEGIN
    -- Actualizar el estado del usuario
    UPDATE USUARIOS 
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
