CREATE DEFINER=`c2611566_soqus`@`%` PROCEDURE `PR_08_LISTA_ROL` ()  
NO SQL 
BEGIN
	SELECT ID_ROL, DESCRIPCION_ROL FROM ROL;
END$$
