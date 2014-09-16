
CREATE OR REPLACE FUNCTION addprogresscomment()
  RETURNS integer AS
$BODY$
DECLARE  
  _check      TEXT;

BEGIN
 SELECT cmnttype_name FROM cmnttype WHERE cmnttype_name = 'Progressing' INTO _check;

 IF(NOT FOUND)THEN
   INSERT INTO cmnttype  
   (cmnttype_name, cmnttype_descrip, cmnttype_editable)  
   VALUES  
   ('Progressing', 'Purchase Order Progressing Comments', false);
 END IF;

 RETURN -1;
 
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE
  COST 100;
ALTER FUNCTION addprogresscomment() OWNER TO xtrole;

SELECT * FROM addprogresscomment();

DROP FUNCTION IF EXISTS addprogresscomment() CASCADE;


